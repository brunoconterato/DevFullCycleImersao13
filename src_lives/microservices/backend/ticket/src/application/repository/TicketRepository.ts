import Ticket from "../../domain/entities/Ticket";

export default interface TicketRepository {
    save(ticket: Ticket): Promise<void>;
}