create table wiki (
    id serial primary key,
    title varchar(100) not null,
    content text not null default '# New Page',
    account_id int not null references account(id),
    created_on timestamp not null default now(),
    constraint u_account_title unique (title, account_id)
);

create table front_page(
    id serial primary key,
    account_id int not null references account(id),
    wiki_id int not null references wiki(id)
);

drop table front_page;