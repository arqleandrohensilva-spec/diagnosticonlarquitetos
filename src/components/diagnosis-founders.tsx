import leandroPhoto from '@/assets/leandro-henrique.jpg.asset.json';
import neandroPhoto from '@/assets/neandro-jacque.jpg.asset.json';

type Founder = {
  name: string;
  registration: string;
  photo?: { src: string; alt: string; width: number; height: number };
};

const founders: Founder[] = [
  {
    name: 'Leandro Henrique',
    registration: 'A252250-0',
    photo: { src: leandroPhoto.url, alt: 'Leandro Henrique, arquiteto e co-fundador da NL Arquitetos', width: 552, height: 690 },
  },
  {
    name: 'Neandro Jacque',
    registration: 'A264629-3',
    photo: { src: neandroPhoto.url, alt: 'Neandro Jacque, arquiteto e co-fundador da NL Arquitetos', width: 508, height: 635 },
  },
];

function FounderProfile({ founder }: { founder: Founder }) {
  return (
    <article className="nl-founder">
      {founder.photo && (
        <img
          className="nl-founder-photo"
          src={founder.photo.src}
          alt={founder.photo.alt}
          loading="lazy"
          width={founder.photo.width}
          height={founder.photo.height}
        />
      )}
      <h3>{founder.name}</h3>
      <p className="nl-founder-role">Arquiteto · Co-fundador</p>
      <p className="nl-founder-registration">CAU {founder.registration}</p>
    </article>
  );
}

export function DiagnosisFounders() {
  return (
    <section className="nl-founders" aria-labelledby="nl-founders-title">
      <div className="nl-section-inner">
        <p className="nl-form-eyebrow">QUEM CONDUZ O SEU DIAGNÓSTICO</p>
        <h2 id="nl-founders-title">Dois arquitetos. Uma mesma régua técnica.</h2>
        <p className="nl-founders-intro">
          A NL Arquitetos é um escritório de arquitetura residencial, interiores e projetos comerciais em São José dos Campos. A conversa do diagnóstico é feita com um dos arquitetos sócios.
        </p>
        <div className="nl-founders-grid">
          {founders.map(founder => <FounderProfile key={founder.registration} founder={founder} />)}
        </div>
      </div>
    </section>
  );
}