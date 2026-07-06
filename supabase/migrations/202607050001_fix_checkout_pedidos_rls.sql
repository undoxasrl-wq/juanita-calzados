create or replace function public.create_pedido_with_items(
  order_payload jsonb,
  items_payload jsonb
)
returns public.pedidos
language plpgsql
security definer
set search_path = public
as $$
declare
  created_order public.pedidos;
begin
  insert into public.pedidos (
    first_name,
    last_name,
    phone,
    address,
    locality,
    observations,
    payment_method,
    total_amount
  )
  values (
    coalesce(order_payload->>'first_name', ''),
    coalesce(order_payload->>'last_name', ''),
    coalesce(order_payload->>'phone', ''),
    coalesce(order_payload->>'address', ''),
    coalesce(order_payload->>'locality', ''),
    nullif(order_payload->>'observations', ''),
    coalesce(order_payload->>'payment_method', 'WhatsApp'),
    coalesce((order_payload->>'total_amount')::numeric, 0)
  )
  returning * into created_order;

  insert into public.pedido_items (
    pedido_id,
    product_id,
    product_name,
    product_image,
    size,
    quantity,
    unit_price_cash,
    unit_price_card,
    subtotal_amount
  )
  select
    created_order.id,
    nullif(item->>'product_id', '')::bigint,
    coalesce(item->>'product_name', ''),
    nullif(item->>'product_image', ''),
    coalesce(item->>'size', ''),
    coalesce((item->>'quantity')::integer, 1),
    coalesce((item->>'unit_price_cash')::numeric, 0),
    coalesce((item->>'unit_price_card')::numeric, 0),
    coalesce((item->>'subtotal_amount')::numeric, 0)
  from jsonb_array_elements(items_payload) as item;

  return created_order;
end;
$$;

grant execute on function public.create_pedido_with_items(jsonb, jsonb) to anon, authenticated;
