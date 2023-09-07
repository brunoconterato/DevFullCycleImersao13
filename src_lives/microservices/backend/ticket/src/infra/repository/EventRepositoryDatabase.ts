import EventRepository from "../../application/repository/EventRepository";
import Event from "../../domain/entities/Event";
import pgp from "pg-promise";

export default class EventRepositoryDatabase implements EventRepository {
  async get(eventId: string): Promise<Event> {
    const connection = pgp()("postgres://admin:admin@localhost:5432/fullcycle");
    const [eventData] = await connection.query(
      "select * from fullcycle.event where event_id = $1",
      [eventId]
    );
    await connection.$pool.end();
    return new Event(
      eventData.event_id,
      eventData.description,
      parseFloat(eventData.price),
      eventData.capacity
    );
  }
}
