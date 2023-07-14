create table assignment (
    id serial primary key,
    deliverable_id int not null references deliverable(id),
    due_date date not null,
    account_id int not null references account(id)
);