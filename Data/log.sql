create table log (
    id serial primary key,
    content text not null,
    created_on timestamptz not null default now(),
    date_time timestamptz not null default now(),
    account_id int not null references account(id)
);