drop schema fullcycle CASCADE;

create schema fullcycle;

create table fullcycle.event (
    event_id uuid,
    description text,
    price numeric,
    capacity integer
);

create table fullcycle.ticket (
    ticket_id uuid,
    event_id uuid,
    email text,
    status text
);

create table fullcycle.transaction (
    transaction_id uuid,
    event_id uuid,
    ticket_id uuid,
    tid uuid,
    price numeric,
    status text
);

insert into fullcycle.event (event_id, description, price, capacity) values (
    'c5889104-5506-4639-9256-5ed6108c6021',
    'System of a Down 29/08/2023',
    200,
    40000
);