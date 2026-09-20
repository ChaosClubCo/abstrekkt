-- Export user data (DSAR) to JSON composite object.
with u as (select id from auth.users where id = :uid)
select json_build_object('user_id', (select id from u)) as user_export;
