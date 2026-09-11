ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS utm_source text,
  ADD COLUMN IF NOT EXISTS utm_medium text,
  ADD COLUMN IF NOT EXISTS utm_campaign text;

COMMENT ON COLUMN public.leads.utm_source IS 'Fonte de tráfego (ex: instagram, google).';
COMMENT ON COLUMN public.leads.utm_medium IS 'Meio de tráfego (ex: reels, cpc, organic).';
COMMENT ON COLUMN public.leads.utm_campaign IS 'Nome da campanha (ex: financiamento).';

GRANT SELECT, INSERT ON public.leads TO anon;
GRANT SELECT, INSERT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;