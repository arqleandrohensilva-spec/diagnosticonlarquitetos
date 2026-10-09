type HeroCopy = { title: string; subtitle: string };

const defaultCopy: HeroCopy = {
  title: 'Antes de construir, entenda exatamente o que o seu projeto precisa.',
  subtitle: 'Uma leitura técnica do seu terreno ou imóvel, feita por arquitetos em São José dos Campos e região — sem compromisso, sem custo.',
};

const interiorsCopy: HeroCopy = {
  title: 'Ambientes pensados para a rotina real da sua família.',
  subtitle: 'Uma leitura técnica do seu imóvel antes de definir layout, marcenaria e iluminação — em São José dos Campos e região, sem compromisso, sem custo.',
};

const campaignCopy: Record<string, HeroCopy> = {
  arquiteto: defaultCopy,
  'projeto-arquitetonico-residencial': defaultCopy,
  'financiamento-caixa': {
    title: 'Vai construir pelo financiamento da Caixa? Entenda cada etapa antes de começar.',
    subtitle: 'Projeto e documentação para o financiamento Terreno + Construção, com arquitetos em São José dos Campos e região — sem compromisso, sem custo.',
  },
  interiores: interiorsCopy,
  'projeto-interiores': interiorsCopy,
  'arquitetura-interiores-integrado': {
    title: 'Arquitetura e interiores decididos juntos, ainda na planta.',
    subtitle: 'Menos incompatibilidade descoberta na obra. Uma leitura técnica do seu caso, em São José dos Campos e região — sem compromisso, sem custo.',
  },
  'regularizacao-documentacao': {
    title: 'Documentação e aprovação sem se perder na burocracia.',
    subtitle: 'RRT, prefeitura e condomínio: entenda o que o seu imóvel precisa — em São José dos Campos e região, sem compromisso, sem custo.',
  },
  'projeto-comercial': {
    title: 'Um espaço que trabalha a favor do seu negócio.',
    subtitle: 'Uma leitura técnica do seu ponto comercial antes do projeto — em São José dos Campos e região, sem compromisso, sem custo.',
  },
};

export function getDiagnosisCopy(content: unknown): HeroCopy {
  return typeof content === 'string' && Object.hasOwn(campaignCopy, content)
    ? campaignCopy[content]
    : defaultCopy;
}