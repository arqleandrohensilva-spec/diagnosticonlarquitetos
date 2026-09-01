import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const Route = createFileRoute('/auth')({
  component: AuthPage,
  head: () => ({
    meta: [
      { title: 'Acesso restrito — NL Arquitetos' },
      { name: 'description', content: 'Área de acesso para a equipe da NL Arquitetos consultar os diagnósticos solicitados.' },
      { property: 'og:title', content: 'Acesso restrito — NL Arquitetos' },
      { property: 'og:description', content: 'Login da equipe NL Arquitetos.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: '/leads', replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
        if (error) throw error;
        navigate({ to: '/leads', replace: true });
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: senha,
          options: { emailRedirectTo: `${window.location.origin}/leads` },
        });
        if (error) throw error;
        if (data.session) {
          toast.success('Acesso criado com sucesso.');
          navigate({ to: '/leads', replace: true });
        } else {
          toast.success('Conta criada. Faça login para continuar.');
          setMode('login');
        }

      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Não foi possível entrar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F5F5] px-6">
      <div className="w-full max-w-sm">
        <p className="text-xs uppercase tracking-[0.28em] text-[#8B7355]">NL Arquitetos</p>
        <h1 className="mt-3 text-3xl text-[#3A3A3A]" style={{ fontFamily: '"Cormorant Garamond", serif' }}>
          {mode === 'login' ? 'Acesso à área interna' : 'Criar acesso'}
        </h1>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Login (e-mail)</Label>
            <Input id="email" type="email" required autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              type="password"
              required
              minLength={6}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={senha}
              onChange={e => setSenha(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-[#8B7355] hover:bg-[#74604A]">
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}
          </Button>
        </form>
        <button
          type="button"
          className="mt-6 text-sm text-[#74604A] underline underline-offset-4"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
        >
          {mode === 'login' ? 'Ainda não tenho acesso — criar conta' : 'Já tenho acesso — entrar'}
        </button>
      </div>
    </main>
  );
}
