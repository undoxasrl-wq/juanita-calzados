DO $$
DECLARE
  current_talles_type text;
BEGIN
  SELECT atttypid::regtype::text
    INTO current_talles_type
  FROM pg_attribute
  WHERE attrelid = 'public.products'::regclass
    AND attname = 'talles'
    AND NOT attisdropped;

  IF current_talles_type IS NULL THEN
    ALTER TABLE public.products
      ADD COLUMN talles integer[] NOT NULL DEFAULT '{}';
  ELSIF current_talles_type = 'text[]' THEN
    ALTER TABLE public.products
      ALTER COLUMN talles TYPE integer[]
      USING (
        ARRAY(
          SELECT value::integer
          FROM unnest(talles) AS value
          WHERE value ~ '^[0-9]+$'
          ORDER BY value::integer
        )
      );
  ELSIF current_talles_type = 'jsonb' THEN
    ALTER TABLE public.products
      ALTER COLUMN talles TYPE integer[]
      USING (
        ARRAY(
          SELECT (value #>> '{}')::integer
          FROM jsonb_array_elements(talles) AS value
          WHERE (value #>> '{}') ~ '^[0-9]+$'
          ORDER BY (value #>> '{}')::integer
        )
      );
  END IF;

  UPDATE public.products
  SET talles = COALESCE(
    (
      SELECT ARRAY(
        SELECT DISTINCT t
        FROM unnest(COALESCE(products.talles, '{}')) AS t
        WHERE t BETWEEN 35 AND 45
        ORDER BY t
      )
    ),
    '{}'
  );

  ALTER TABLE public.products
    ALTER COLUMN talles SET DEFAULT '{}',
    ALTER COLUMN talles SET NOT NULL;
END $$;
