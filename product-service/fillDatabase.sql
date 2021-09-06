CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists products (
	id uuid primary key default uuid_generate_v4(),
	title text not null,
	description text,
	price integer
)

create table if not exists stocks (
	"product_id" uuid,
	"count" integer,
	foreign key ("product_id") references "products" ("id") 
)

-- select * from information_schema.tables


insert into products (title, description, price) values
('Auto 1', 'Fast and furious', 1500),
('Auto 2', 'Braaah', 300),
('Auto 3', 'Grandad''s car', 530.5)

insert into stocks (product_id, "count") values
((select id from products p where p.title = 'Auto 1'), 5),
((select id from products p where p.title = 'Auto 2'), 1),
((select id from products p where p.title = 'Auto 3'), 0)

-- select p.title, s.count from products p left join  stocks s on p.id = s.product_id 