export function Footer({ email, githubUrl }: { email: string; githubUrl: string }) {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border)',
        padding: '30px 36px',
        textAlign: 'center',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        color: 'var(--faint)',
      }}
    >
      <a href={`mailto:${email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{email}</a>
      {' · '}
      <a href={githubUrl} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>
        {githubUrl.replace('https://', '')}
      </a>
      {' · Ahmedabad, India'}
    </footer>
  )
}
