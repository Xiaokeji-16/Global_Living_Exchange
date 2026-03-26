alter table public.properties
add column if not exists street_address text,
add column if not exists state_region text,
add column if not exists postcode text;
