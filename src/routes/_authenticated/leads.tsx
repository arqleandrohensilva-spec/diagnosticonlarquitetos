import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

export const Route = createFileRoute('/_authenticated/leads')({
  component: LeadsPage,
  head: () => ({
    meta: [
      { title: 'Diagnósticos recebidos — NL Arquitetos' },
      { name: 'description', content: 'Lista dos pedidos de diagnóstico gratuito enviados pelo site da NL Arquitetos.' },
      { property: 'og:title', content: 'Diagnósticos recebidos — NL Arquitetos' },
      { property: 'og:description', content: 'Painel interno de leads da NL Arquitetos.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
});

interface Lead {
  id: string;
  nome: string;
  whatsapp: string;
  situacao: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

const SERIF = { fontFamily: '"Cormorant Garamond", serif' } as const;

function startOfWeek(date: Date): Date {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function weekLabel(d: Date): string {
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
}

function rankBy(items: (string | null)[], limit?: number) {
  const counts = new Map<string, number>();
  for (const item of items) {
    if (!item) continue;
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
}

function LeadsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async (): Promise<Lead[]> => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: '/auth', replace: true });
  }

  const leads = data ?? [];
  const total = leads.length;
  const comUtm = leads.filter(l => l.utm_source || l.utm_medium || l.utm_campaign).length;
  const direto = total - comUtm;
  const campaignRank = rankBy(leads.map(l => l.utm_campaign), 5);
  const mediumRank = rankBy(leads.map(l => l.utm_medium));

  const weeklyMap = new Map<number, { leads: number; label: string }>();
  for (const lead of leads) {
    if (!lead.created_at) continue;
    const week = startOfWeek(new Date(lead.created_at));
    const key = week.getTime();
    const entry = weeklyMap.get(key) ?? { leads: 0, label: weekLabel(week) };
    entry.leads += 1;
    weeklyMap.set(key, entry);
  }
  const weeklyData = [...weeklyMap.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => ({ semana: v.label, leads: v.leads }));

  const chartConfig: ChartConfig = {
    leads: { label: 'Leads', color: '#8B7355' },
  };

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8B7355]">NL Arquitetos</p>
            <h1 className="mt-2 text-3xl text-[#3A3A3A]" style={SERIF}>
              Diagnósticos recebidos
            </h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sair</Button>
        </div>

        {/* Resumo */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-[#e2ded7] bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#8B7355]">Total de leads</p>
            <p className="mt-2 text-4xl text-[#3A3A3A]" style={SERIF}>{total}</p>
          </div>
          <div className="rounded-lg border border-[#e2ded7] bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#8B7355]">Origem identificada</p>
            <p className="mt-2 text-4xl text-[#3A3A3A]" style={SERIF}>{comUtm}</p>
            <p className="mt-1 text-xs text-[#3A3A3A]/60">Direto (sem UTM): {direto}</p>
          </div>
          <div className="rounded-lg border border-[#e2ded7] bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#8B7355]">Top campanhas</p>
            {campaignRank.length === 0 ? (
              <p className="mt-2 text-sm text-[#3A3A3A]/60">Nenhuma campanha registrada.</p>
            ) : (
              <ol className="mt-2 space-y-1 text-sm text-[#3A3A3A]">
                {campaignRank.map(([name, count]) => (
                  <li key={name} className="flex items-baseline justify-between gap-2">
                    <span className="truncate">{name}</span>
                    <span className="shrink-0 text-[#8B7355]">{count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="rounded-lg border border-[#e2ded7] bg-white p-5">
            <p className="text-xs uppercase tracking-wider text-[#8B7355]">Ranking por medium</p>
            {mediumRank.length === 0 ? (
              <p className="mt-2 text-sm text-[#3A3A3A]/60">Nenhum medium registrado.</p>
            ) : (
              <ol className="mt-2 space-y-1 text-sm text-[#3A3A3A]">
                {mediumRank.map(([name, count]) => (
                  <li key={name} className="flex items-baseline justify-between gap-2">
                    <span className="truncate">{name}</span>
                    <span className="shrink-0 text-[#8B7355]">{count}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>

        {/* Evolução semanal */}
        <div className="mt-6 rounded-lg border border-[#e2ded7] bg-white p-5">
          <h2 className="text-xl text-[#3A3A3A]" style={SERIF}>Leads por semana</h2>
          {weeklyData.length === 0 ? (
            <p className="mt-4 text-sm text-[#3A3A3A]/70">Sem dados para exibir.</p>
          ) : (
            <ChartContainer config={chartConfig} className="mt-4 h-64 w-full">
              <BarChart data={weeklyData} margin={{ left: 8, right: 8, top: 8 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis dataKey="semana" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="leads" fill="var(--color-leads)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          )}
        </div>

        {/* Tabela */}
        <div className="mt-6 overflow-x-auto rounded-lg border border-[#e2ded7] bg-white">
          {isLoading ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Carregando...</p>
          ) : error ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Não foi possível carregar os leads.</p>
          ) : !leads.length ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Nenhum diagnóstico solicitado ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e2ded7] text-xs uppercase tracking-wider text-[#8B7355]">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3">Fonte</th>
                  <th className="px-4 py-3">Medium</th>
                  <th className="px-4 py-3">Campanha</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {leads.map(lead => (
                  <tr key={lead.id} className="border-b border-[#f0ede8] last:border-0 text-[#3A3A3A]">
                    <td className="px-4 py-3">{lead.nome}</td>
                    <td className="px-4 py-3">
                      <a className="underline underline-offset-2" href={`https://wa.me/55${String(lead.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3">{lead.situacao}</td>
                    <td className="px-4 py-3">{lead.utm_source ?? '—'}</td>
                    <td className="px-4 py-3">{lead.utm_medium ?? '—'}</td>
                    <td className="px-4 py-3">{lead.utm_campaign ?? '—'}</td>
                    <td className="px-4 py-3">
                      {lead.created_at ? new Date(lead.created_at).toLocaleString('pt-BR') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
