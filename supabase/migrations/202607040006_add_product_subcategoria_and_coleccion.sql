do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'subcategoria'
  ) then
    alter table public.products
      add column subcategoria text;
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'coleccion'
  ) then
    alter table public.products
      add column coleccion text;
  end if;
end
$$;