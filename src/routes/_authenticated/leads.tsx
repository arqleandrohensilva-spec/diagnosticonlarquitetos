import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';

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

function LeadsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: '/auth', replace: true });
  }

  return (
    <main className="min-h-screen bg-[#F5F5F5] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-[#8B7355]">NL Arquitetos</p>
            <h1 className="mt-2 text-3xl text-[#3A3A3A]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
              Diagnósticos recebidos
            </h1>
          </div>
          <Button variant="outline" onClick={handleSignOut}>Sair</Button>
        </div>

        <div className="mt-8 overflow-x-auto rounded-lg border border-[#e2ded7] bg-white">
          {isLoading ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Carregando...</p>
          ) : error ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Não foi possível carregar os leads.</p>
          ) : !data?.length ? (
            <p className="p-6 text-sm text-[#3A3A3A]/70">Nenhum diagnóstico solicitado ainda.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e2ded7] text-xs uppercase tracking-wider text-[#8B7355]">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">WhatsApp</th>
                  <th className="px-4 py-3">Situação</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody>
                {data.map(lead => (
                  <tr key={lead.id} className="border-b border-[#f0ede8] last:border-0 text-[#3A3A3A]">
                    <td className="px-4 py-3">{lead.nome}</td>
                    <td className="px-4 py-3">
                      <a className="underline underline-offset-2" href={`https://wa.me/55${String(lead.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noreferrer">
                        {lead.whatsapp}
                      </a>
                    </td>
                    <td className="px-4 py-3">{lead.situacao}</td>
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
