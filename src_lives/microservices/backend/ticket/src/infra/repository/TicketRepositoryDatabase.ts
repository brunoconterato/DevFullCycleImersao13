import TicketRepository from "../../application/repository/TicketRepository";
import Ticket from "../../domain/entities/Ticket";
import pgp from "pg-promise";

export default class TicketRepositoryDatabase implements TicketRepository {
  async save(ticket: Ticket): Promise<void> {
    const connection = pgp()(
      "postgres://admin:admin@localhost:5432/fullcycle"
    );
    await connection.query(
      "insert into fullcycle.ticket (ticket_id, event_id, email, status) values ($1, $2, $3, $4)",
      [ticket.ticketId, ticket.eventId, ticket.email, ticket.status]
    );
    await connection.$pool.end();
  }
}
