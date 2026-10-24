// The `from` parameter says where to go after signing in. It comes from the URL, so anyone can write
// anything into it: only a path inside this app is accepted, and never one that leads back to a sign-in
// page (that would redirect in a loop).
export function readFrom(params: URLSearchParams) {
  const from = params.get('from')
  if (!from || !from.startsWith('/') || from.startsWith('//') || from.startsWith('/\\')) return null
  if (
    from === '/sign-in' ||
    from === '/sign-up' ||
    from.startsWith('/sign-in?') ||
    from.startsWith('/sign-up?')
  ) {
    return null
  }
  return from
}

// The query string that carries `from` over when switching between the sign-in and sign-up pages.
export function fromQuery(from: string | null) {
  return from ? `?from=${encodeURIComponent(from)}` : ''
}
