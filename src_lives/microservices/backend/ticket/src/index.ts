import express, { Request, Response } from "express";
import PurchaseTicket from "./application/usecase/PurchaseTicket";
import Registry from "./infra/registry/Registry";
import TicketRepositoryDatabase from "./infra/repository/TicketRepositoryDatabase";
const app = express();
app.use(express.json());

app.post("/purchase-ticket", async function (req: Request, res: Response) {
  const registry = new Registry();
  registry.provide("ticketRepository", new TicketRepositoryDatabase());
  const purchaseTicket = new PurchaseTicket(registry);
  const output = await purchaseTicket.execute(req.body);
  console.log(output);
  res.json(output);
});

app.listen(3000);
