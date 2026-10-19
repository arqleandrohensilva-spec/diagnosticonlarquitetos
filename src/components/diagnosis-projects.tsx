import casaCostas from '@/assets/projeto-casa-costas.jpg';
import residenciaJardim from '@/assets/projeto-residencia-jardim.jpg';

const projetos = [
  {
    src: casaCostas,
    nome: 'Casa Costas',
    local: '2024 · São José dos Campos, SP',
    alt: 'Fachada da Casa Costas ao anoitecer, projeto da NL Arquitetos em São José dos Campos',
  },
  {
    src: residenciaJardim,
    nome: 'Residência Jardim',
    local: '2025 · Jacareí, SP',
    alt: 'Área gourmet da Residência Jardim com cozinha integrada, projeto da NL Arquitetos em Jacareí',
  },
];

export function DiagnosisProjects() {
  return (
    <section className="nl-projects" aria-labelledby="nl-projects-title">
      <div className="nl-section-inner">
        <p className="nl-form-eyebrow">PROJETOS DA NL</p>
        <h2 id="nl-projects-title">Decidido no papel. Construído sem improviso.</h2>
        <div className="nl-projects-grid">
          {projetos.map(p => (
            <figure key={p.nome} className="nl-project">
              <img src={p.src} alt={p.alt} loading="lazy" width={1200} height={900} />
              <figcaption>
                <span className="nl-project-name">{p.nome}</span>
                <span className="nl-project-local">{p.local}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
