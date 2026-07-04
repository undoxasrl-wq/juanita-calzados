DO $$
DECLARE
  current_talles_type text;
  valid_talles text[] := ARRAY[
    '35','36','37','38','39','40','41','42','43','44','45',
    'XS','S','M','L','XL','XXL'
  ];
BEGIN
  SELECT atttypid::regtype::text
    INTO current_talles_type
  FROM pg_attribute
  WHERE attrelid = 'public.products'::regclass
    AND attname = 'talles'
    AND NOT attisdropped;

  IF current_talles_type IS NULL THEN
    ALTER TABLE public.products
      ADD COLUMN talles text[] NOT NULL DEFAULT '{}';
  ELSIF current_talles_type = 'integer[]' THEN
    ALTER TABLE public.products
      ALTER COLUMN talles TYPE text[]
      USING (
        ARRAY(
          SELECT value::text
          FROM unnest(talles) AS value
        )
      );
  ELSIF current_talles_type = 'jsonb' THEN
    ALTER TABLE public.products
      ALTER COLUMN talles TYPE text[]
      USING (
        ARRAY(
          SELECT upper(trim(value))
          FROM jsonb_array_elements_text(talles) AS value
        )
      );
  END IF;

  UPDATE public.products
  SET talles = COALESCE(
    (
      SELECT ARRAY(
        SELECT DISTINCT normalized
        FROM (
          SELECT upper(trim(value)) AS normalized
          FROM unnest(COALESCE(products.talles, '{}'::text[])) AS value
        ) talles_limpios
        WHERE normalized = ANY(valid_talles)
        ORDER BY array_position(valid_talles, normalized)
      )
    ),
    '{}'::text[]
  );

  ALTER TABLE public.products
    ALTER COLUMN talles SET DEFAULT '{}',
    ALTER COLUMN talles SET NOT NULL;
END $$;
