ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS utm_content text;
COMMENT ON COLUMN public.leads.utm_content IS 'Conteúdo/variação do anúncio ou vitrine (ex: financiamento-caixa)';