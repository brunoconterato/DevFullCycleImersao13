import crypto from "crypto";

export default class Ticket {
  private constructor(
    readonly ticketId: string,
    readonly eventId: string,
    readonly email: string,
    public status: string
  ) {}

  // Lembra o factory method Gang of 4: private constructor + creator method
  // Porem diferente pq o factory do Go4 implica herança (método create herda da superclasse abstrata)
  static create(enventId: string, email: string) {
    const ticketId = crypto.randomUUID();
    const initialStatus = "reserved";
    return new Ticket(ticketId, enventId, email, initialStatus);
  }

  public approve() {
    this.status = "approved";
  }

  public cancel() {
    this.status = "cancelled";
  }
}
