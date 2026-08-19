import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { toast } from 'sonner';
import heroImg from '@/assets/arq-hero.jpg';

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

const etapas = [
  { n: '01', t: 'Leitura do terreno', d: 'Potencial construtivo, orientação solar e restrições legais.' },
  { n: '02', t: 'Direção de projeto', d: 'Programa e partido arquitetônico inicial.' },
  { n: '03', t: 'Caminho até a obra', d: 'Documentação, aprovação e acompanhamento executivo.' },
];

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
      <div className="nl-split">
        <section className="nl-pitch">
          <img className="nl-bg" src={heroImg} alt="Residência contemporânea em concreto ao anoitecer" width={1280} height={1600} />
          <div className="nl-veil" />
          <div className="nl-pitch-inner">
            <header className="mark">
              <span className="mark-nl">NL</span>
              <span className="mark-arq">ARQUITETOS</span>
            </header>

            <div className="nl-pitch-body">
              <p className="kicker">Diagnóstico gratuito</p>
              <h1>
                Antes de construir,
                <em> entenda exatamente </em>
                o que o seu projeto precisa.
              </h1>
              <p className="sub">
                Uma leitura técnica do seu terreno ou imóvel, feita por arquitetos — sem
                compromisso, sem custo.
              </p>

              <ol className="nl-steps">
                {etapas.map(e => (
                  <li key={e.n}>
                    <span className="nl-step-n">{e.n}</span>
                    <div>
                      <strong>{e.t}</strong>
                      <span>{e.d}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <p className="trust">Projeto completo, documentação e acompanhamento — do primeiro esboço à aprovação.</p>
          </div>
        </section>

        <section className="nl-form-col">
          <div className="nl-form-wrap">
            <p className="nl-form-eyebrow">Solicite seu diagnóstico</p>
            <h2 className="nl-form-title">Três informações. Uma resposta clara.</h2>
            <div className="nl-rule" />

            <form onSubmit={handleSubmit}>
              <div className="field">
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" required value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
              </div>

              <div className="field">
                <label htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="tel"
                  required
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div className="field">
                <label htmlFor="situacao">Situação atual</label>
                <select id="situacao" required value={situacao} onChange={e => setSituacao(e.target.value)}>
                  <option value="">Selecione</option>
                  <option value="terreno">Tenho terreno e não sei por onde começar</option>
                  <option value="aluguel">Estou no aluguel, pensando em construir</option>
                  <option value="reforma">Já tenho imóvel e quero reformar</option>
                </select>
              </div>

              <label className="consent">
                <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} />
                <span>Aceito receber contato da NL Arquitetos sobre meu diagnóstico.</span>
              </label>

              <button type="submit">Quero meu diagnóstico</button>
              <p className="nl-note">Resposta em até 24h úteis, após conversa rápida com o arquiteto · Sem custo · Sem compromisso</p>
            </form>
          </div>

          <footer className="footer">NL Arquitetos · A arquitetura como decisão</footer>
        </section>
      </div>
    </div>
  );
}
