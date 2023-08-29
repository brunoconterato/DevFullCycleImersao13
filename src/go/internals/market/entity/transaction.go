package entity

import (
	"time"

	"github.com/google/uuid"
)

type Transaction struct {
	ID           string
	SellingOrder *Order
	BuyingOrder  *Order
	Shares       int
	Price        float64
	Total        float64
	DateTime     time.Time
}

func NewTransation(sellingOrder *Order, buyingOrder *Order, shares int, price float64) *Transaction {
	return &Transaction{
		ID:           uuid.New().String(),
		SellingOrder: sellingOrder,
		BuyingOrder:  buyingOrder,
		Shares:       shares,
		Price:        price,
		Total:        float64(shares) * price,
		DateTime:     time.Now(),
	}
}

func (transaction *Transaction) CalculateTotal(shares int, price float64) {
	transaction.Total = float64(shares) * price
}

func (transaction *Transaction) AddShares(shares int) {
	transaction.Shares += shares
}

func (transaction *Transaction) CheckClose() {
	if transaction.BuyingOrder.Shares == 0 {
		transaction.BuyingOrder.Status = "CLOSED"
	}
	if transaction.SellingOrder.Shares == 0 {
		transaction.SellingOrder.Status = "CLOSED"
	}
}
