import Transaction from "../../domain/entities/Transaction";
import Registry from "../../infra/registry/Registry";
import PaymentGateway from "../gateway/PaymentGatewat";
import TransactionRepository from "../repository/TransactionRepository";

export default class ProcessPayment {
  transactionRepository: TransactionRepository;
  paymentGateway: PaymentGateway;

  constructor(readonly registry: Registry) {
    this.transactionRepository = registry.inject("transactionRepository");
    this.paymentGateway = registry.inject("paymentGateway");
  }

  async execute(input: Input): Promise<Output> {
    const output = await this.paymentGateway.createTransaction({
      email: input.email,
      creditCardToken: input.creditCardToken,
      price: input.price,
    });
    const transaction = Transaction.create(
      input.ticketId,
      input.eventId,
      output.tid,
      input.price,
      output.status
    );

    await this.transactionRepository.save(transaction);

    return {
      tid: transaction.tid,
      price: transaction.price,
      status: output.status,
    };
  }
}

type Input = {
  ticketId: string;
  eventId: string;
  price: number;
  email: string;
  creditCardToken: string;
};

type Output = {
  tid: string;
  price: number;
  status: string;
};
