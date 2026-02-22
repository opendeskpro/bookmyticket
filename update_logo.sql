UPDATE public.site_config
SET config_value = config_value || '{"logo_url": "/logo.jpeg"}'::jsonb
WHERE section_key = 'brand_assets';
