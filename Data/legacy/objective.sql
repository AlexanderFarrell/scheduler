create table objective (
    id serial primary key,
    title varchar(60) not null,
    description text not null default ''
);

create table objective_link(
    id serial primary key,
    objective_parent_id int not null references objective(id),
    objective_child_id int not null references objective(id),
    constraint u_objective_parent_child unique (objective_child_id, objective_parent_id)
);

create table objective_project_link(
    id serial primary key,
    objective_id int not null references objective(id),
    project_id int not null references project(id),
    constraint u_objective_project unique (objective_id, project_id)
);

alter table objective
add column created_on timestamptz default now();

alter table objective
add column account_id int not null references account(id);