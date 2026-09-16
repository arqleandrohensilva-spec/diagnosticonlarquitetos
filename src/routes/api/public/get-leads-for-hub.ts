import { createFileRoute } from '@tanstack/react-router'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, x-hub-secret',
  'Access-Control-Max-Age': '86400',
}

function timingSafeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder()
  const aBytes = enc.encode(a)
  const bBytes = enc.encode(b)
  if (aBytes.length !== bBytes.length) return false
  let diff = 0
  for (let i = 0; i < aBytes.length; i++) diff |= aBytes[i]! ^ bBytes[i]!
  return diff === 0
}

export const Route = createFileRoute('/api/public/get-leads-for-hub')({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204, headers: corsHeaders }),

      GET: async ({ request }) => {
        const expected = process.env['HUB_ACCESS_SECRET']
        const provided = request.headers.get('x-hub-secret')

        if (!expected || !provided || !timingSafeEqual(provided, expected)) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

        const { data, error } = await supabaseAdmin
          .from('leads')
          .select('id, nome, whatsapp, situacao, utm_source, utm_medium, utm_campaign, created_at')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('get-leads-for-hub query error:', error.message)
          return new Response(JSON.stringify({ error: 'Failed to fetch leads' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          })
        }

        return new Response(JSON.stringify({ leads: data ?? [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...corsHeaders },
        })
      },
    },
  },
})
