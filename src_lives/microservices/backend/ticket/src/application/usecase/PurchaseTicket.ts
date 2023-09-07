import Ticket from "../../domain/entities/Ticket";
import Registry from "../../infra/registry/Registry";
import EventRepository from "../repository/EventRepository";
import TicketRepository from "../repository/TicketRepository";

export default class PurchaseTicket {
  eventRepository: EventRepository;
  ticketRepository: TicketRepository;

  constructor(readonly registry: Registry) {
    // Segundo o instrutor: não façam isso em casa!
    this.eventRepository = registry.inject("eventRepository");
    this.ticketRepository = registry.inject("ticketRepository");
  }

  async execute(input: Input): Promise<Output> {
    const event = await this.eventRepository.get(input.eventId);
    console.log(event)
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);

    // Processar o cartão de crédito

    // Criar e salvar transação

    // mandar email com o ticket
    return {
      ticketId: ticket.ticketId,
      status: ticket.status,
    };
  }
}

type Input = {
  eventId: string;
  email: string;
  creditCardToken: string;
};

type Output = {
  ticketId: string;
  status: string;
};
