import express, { Request, Response } from "express";
import PurchaseTicket from "./application/usecase/PurchaseTicket";
import Registry from "./infra/registry/Registry";
import TicketRepositoryDatabase from "./infra/repository/TicketRepositoryDatabase";
import EventRepositoryDatabase from "./infra/repository/EventRepositoryDatabase";
import FakePaymentGateway from "./infra/gateway/FakePaymentGateway";
import TransactionRepositoryDatabase from "./infra/repository/TransactionRepositoryDatabase";
import ProcessPayment from "./application/usecase/ProcessPayment";
import RabbitMQAdapter from "./infra/queue/RabbitMQueueAdapter";
const app = express();
app.use(express.json());

async function main() {
  const registry = new Registry();
  registry.provide("ticketRepository", new TicketRepositoryDatabase());
  registry.provide("eventRepository", new EventRepositoryDatabase());
  registry.provide("paymentGateway", new FakePaymentGateway());
  registry.provide(
    "transactionRepository",
    new TransactionRepositoryDatabase()
  );
  registry.provide("processPayment", new ProcessPayment(registry));

  const queue = new RabbitMQAdapter();
  await queue.connect()
  registry.provide("queue", queue);

  app.post("/purchase-ticket", async function (req: Request, res: Response) {
    const purchaseTicket = new PurchaseTicket(registry);
    const output = await purchaseTicket.execute(req.body);
    res.json(output);
  });

  app.listen(3000);
}

main();
