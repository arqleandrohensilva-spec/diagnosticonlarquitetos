import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';

export const Route = createFileRoute('/')({
  component: DiagnosticoPage,
  head: () => ({
    meta: [
      { title: 'NL Arquitetos — Diagnóstico Gratuito' },
      {
        name: 'description',
        content:
          'Receba um diagnóstico gratuito sobre seu terreno ou imóvel. Projeto arquitetônico completo, documentação e acompanhamento.',
      },
      { property: 'og:title', content: 'NL Arquitetos — Diagnóstico Gratuito' },
      {
        property: 'og:description',
        content:
          'Antes de construir, entenda exatamente o que o seu projeto precisa. Diagnóstico gratuito e sem compromisso.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
});

function DiagnosticoPage() {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [situacao, setSituacao] = useState('');
  const [consent, setConsent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      toast.error('É necessário aceitar o contato para continuar.');
      return;
    }
    toast.success('Recebemos seus dados! Entraremos em contato pelo WhatsApp.');
    setNome('');
    setWhatsapp('');
    setSituacao('');
    setConsent(false);
  }

  return (
    <div className="nl-root">
      <div className="page">
        <div className="sheet">
          <div className="sheet-inner">
            <section className="col-pitch">
              <div className="mark">
                <span className="mark-nl">NL</span>
                <span className="mark-arq">ARQUITETOS</span>
              </div>

              <p className="kicker">Diagnóstico gratuito</p>
              <h1>Antes de construir, entenda exatamente o que o seu projeto precisa.</h1>
              <p className="sub">
                Preencha os dados ao lado e receba, sem compromisso, um diagnóstico sobre o seu
                terreno ou imóvel.
              </p>
              <p className="trust">
                Projeto arquitetônico completo, documentação e acompanhamento — do primeiro esboço à
                aprovação.
              </p>
            </section>

            <section className="col-form">
              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="nome">Nome completo</label>
                  <input
                    id="nome"
                    required
                    value={nome}
                    onChange={e => setNome(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="whatsapp">WhatsApp</label>
                  <input
                    id="whatsapp"
                    type="tel"
                    required
                    value={whatsapp}
                    onChange={e => setWhatsapp(e.target.value)}
                  />
                </div>

                <div className="field">
                  <label htmlFor="situacao">Situação atual</label>
                  <select
                    id="situacao"
                    required
                    value={situacao}
                    onChange={e => setSituacao(e.target.value)}
                  >
                    <option value="">Selecione</option>
                    <option value="terreno">Tenho terreno e não sei por onde começar</option>
                    <option value="aluguel">Estou no aluguel, pensando em construir</option>
                    <option value="reforma">Já tenho imóvel e quero reformar</option>
                  </select>
                </div>

                <label className="consent">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                  />
                  <span>Aceito receber contato da NL Arquitetos sobre meu diagnóstico.</span>
                </label>

                <button type="submit">Quero meu diagnóstico</button>
              </form>
            </section>
          </div>
        </div>
      </div>

      <footer className="footer">NL Arquitetos · Diagnóstico · A arquitetura como decisão</footer>
    </div>
  );
}
