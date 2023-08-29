import Ticket from "../../domain/entities/Ticket";
import Registry from "../../infra/registry/Registry";
import TicketRepository from "../repository/TicketRepository";

export default class PurchaseTicket {
  ticketRepository: TicketRepository;

  constructor(readonly registry: Registry) {
    this.ticketRepository = registry.inject("ticketRepository");
  }

  async execute(input: Input): Promise<Output> {
    const ticket = Ticket.create(input.eventId, input.email);
    await this.ticketRepository.save(ticket);
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
