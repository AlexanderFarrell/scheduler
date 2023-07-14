create table asset (
    id serial primary key,
    name varchar(100) not null,
    purchase_value decimal(10, 2) not null default 0,
    purchase_date date,
    account_id int not null references account(id)
);