import Ticket from "../../domain/entities/Ticket";
import Transaction from "../../domain/entities/Transaction";
import TicketReserved from "../../domain/events/TicketReserved";
import Queue from "../../infra/queue/Queue";
import Registry from "../../infra/registry/Registry";
import PaymentGateway from "../gateway/PaymentGatewat";
import EventRepository from "../repository/EventRepository";
import TicketRepository from "../repository/TicketRepository";
import TransactionRepository from "../repository/TransactionRepository";
import ProcessPayment from "./ProcessPayment";

export default class PurchaseTicket {
  eventRepository: EventRepository;
  ticketRepository: TicketRepository;
  processPayment: ProcessPayment;
  queue: Queue;

  constructor(readonly registry: Registry) {
    // Segundo o instrutor: não façam isso em casa!
    this.eventRepository = registry.inject("eventRepository");
    this.ticketRepository = registry.inject("ticketRepository");
    this.processPayment = registry.inject("processPayment");
    this.queue = registry.inject("queue");
  }

  async execute(input: Input): Promise<Output> {
    const event = await this.eventRepository.get(input.eventId);
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);

    // Código aqui é tudo ou nada! Tudo síncrono sequencial
    // Se gateway está quebrado, tudo quebra.
    // Vamos refazer de forma mais inteligente

    const ticketReserved = new TicketReserved(
      ticket.ticketId,
      ticket.eventId,
      input.creditCardToken,
      event.price
    );
    await this.queue.publish("ticketReserved", ticketReserved);

    return { ticketId: ticket.ticketId };
    // const output = await this.processPayment.execute({
    //   eventId: event.eventId,
    //   ticketId: ticket.ticketId,
    //   email: ticket.email,
    //   creditCardToken: input.creditCardToken,
    //   price: event.price,
    // });
    // if (output.status === "approved") {
    //   ticket.approve();
    // } else {
    //   ticket.cancel();
    // }
    // await this.ticketRepository.update(ticket);

    // return {
    //   ticketId: ticket.ticketId,
    //   status: ticket.status,
    //   tid: output.tid,
    //   price: output.price,
    // };
  }
}

type Input = {
  eventId: string;
  email: string;
  creditCardToken: string;
};

type Output = {
  ticketId: string;
};
