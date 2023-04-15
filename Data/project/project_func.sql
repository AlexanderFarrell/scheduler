create or replace procedure set_category_to_project(
    username_in varchar(20),
    category_in varchar(50),
    project_id_in int
)
    language plpgsql
as $$
BEGIN
    insert into project_category (title, account_id)
    select category_in, (select id from account where username=username_in)
    where not exists(
        select 1 from project_category where title=category_in and account_id=
                                                                   (select id from account where username=username_in)
    );

    update project p
    set category_id=(select id
                     from project_category c
                     where c.title=category_in)
    where p.id = project_id_in
    and account_id=(select id from account where username=username_in);

--     delete from project_category


--     insert into project_category_link (category_id, project_id)
--     values ((select id from project_category where title=category_in),
--             project_id_in
--            );
end;$$;

create or replace procedure delete_project(
    project_id_in int
)
    language plpgsql
as $$BEGIN
    update project
        set parent_id=null
    where parent_id=project_id_in;

--     delete from project_category_link
--     where project_id=project_id_in;

    delete from deliverable
    where project_id=project_id_in;

    delete from project_wiki_link
    where project_id=project_id_in;

    delete from project
    where id=project_id_in;
end;
$$;