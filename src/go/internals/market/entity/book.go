package entity

import (
	"container/heap"
	"sync"
)

// Importantissimo: faz correlacao compra/venda

type Book struct {
	Orders        []*Order
	Transactions  []*Transaction
	OrdersChan    chan *Order // Fica recebendo ordens do Kafka
	OrdersChanOut chan *Order
	Wg            *sync.WaitGroup
}

func NewBook(orderChan chan *Order, orderChanOut chan *Order, wg *sync.WaitGroup) *Book {
	return &Book{
		Orders:        []*Order{},
		Transactions:  []*Transaction{},
		OrdersChan:    orderChan,
		OrdersChanOut: orderChanOut,
		Wg:            wg,
	}
}

// Essa função vai executar em uma thred separada
// Funcionará como loop infinito por causa do for
func (book *Book) Trade() {
	buyOrders := NewOrderQueue()
	sellOrders := NewOrderQueue()

	heap.Init(buyOrders)
	heap.Init(sellOrders)

	// Toda vez que chegar uma ordem no channel, esse loop executa
	// TODO: refactor!
	for order := range book.OrdersChan {
		if order.OrderType == "BUY" {
			buyOrders.Push(order)
			if sellOrders.Len() > 0 && sellOrders.Orders[0].Price <= order.Price {
				sellOrder := sellOrders.Pop().(*Order)
				if sellOrder.PendingShares > 0 {
					transaction := NewTransation(sellOrder, order, order.Shares, sellOrder.Price)
					book.AddTransaction(transaction, book.Wg)
					sellOrder.Transactions = append(sellOrder.Transactions, transaction)
					order.Transactions = append(order.Transactions, transaction)
					book.OrdersChanOut <- sellOrder
					book.OrdersChanOut <- order
					if sellOrder.PendingShares == 0 {
						sellOrders.Push(sellOrder)
					}
				}

			}
		} else if order.OrderType == "SELL" {
			sellOrders.Push(order)
			if buyOrders.Len() > 0 && buyOrders.Orders[0].Price >= order.Price {
				buyOrder := buyOrders.Pop().(*Order)
				if buyOrder.PendingShares > 0 {
					transaction := NewTransation(order, buyOrder, order.Shares, buyOrder.Price)
					book.AddTransaction(transaction, book.Wg)
					buyOrder.Transactions = append(buyOrder.Transactions, transaction)
					order.Transactions = append(order.Transactions, transaction)
					book.OrdersChanOut <- buyOrder
					book.OrdersChanOut <- order
					if buyOrder.PendingShares == 0 {
						buyOrders.Push(buyOrder)
					}
				}
			}
		}
	}
}

func (book *Book) AddTransaction(transaction *Transaction, wg *sync.WaitGroup) {
	defer wg.Done() // Executa tudo embaixo primeiro, depois executa esta linha

	sellingShares := transaction.SellingOrder.Shares
	buyingShares := transaction.BuyingOrder.Shares

	minShares := sellingShares
	if buyingShares < sellingShares {
		minShares = buyingShares
	}

	transaction.SellingOrder.Investor.UpdateAssetPosition(transaction.SellingOrder.Asset.ID, -minShares)
	// transaction.SellingOrder.Shares -= minShares
	transaction.SellingOrder.subtractPendingShares(minShares)
	transaction.BuyingOrder.Investor.UpdateAssetPosition(transaction.BuyingOrder.Asset.ID, minShares)
	// transaction.BuyingOrder.Shares -= minShares
	transaction.BuyingOrder.subtractPendingShares(minShares)

	// transaction.Total = float64(minShares) * transaction.BuyingOrder.Price
	// Bem melhor:
	// O book não precisa conhecer a regra de negócio da transaction para cálculo de total
	// Por isso é bem melhor atribuir isso à transaction em si
	// Princípio da responsabilidade única
	transaction.CalculateTotal(minShares, transaction.BuyingOrder.Price)
	transaction.CheckClose()

	book.Transactions = append(book.Transactions, transaction)
}
