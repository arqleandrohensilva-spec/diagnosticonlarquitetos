// Google Ads — tag da conta e conversão "Lead diagnóstico".
export const GOOGLE_ADS_ID = 'AW-18504034395';

// Rótulo da conversão (parte depois da barra em send_to). Vazio = evento não é enviado.
export const GOOGLE_ADS_LEAD_LABEL = '';

type Gtag = (...args: unknown[]) => void;

export function trackLeadConversion() {
  if (typeof window === 'undefined' || !GOOGLE_ADS_LEAD_LABEL) return;
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'conversion', {
    send_to: `${GOOGLE_ADS_ID}/${GOOGLE_ADS_LEAD_LABEL}`,
    transport_type: 'beacon',
  });
}
