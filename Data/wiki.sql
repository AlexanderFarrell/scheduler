create table wiki (
    id serial primary key,
    title varchar(100) not null,
    content text not null default '# New Page',
    account_id int not null references account(id),
    created_on timestamp not null default now(),
    constraint u_account_title unique (title, account_id)
);