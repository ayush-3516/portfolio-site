import { NavClient } from './NavClient'

export function Nav({
  email,
  githubUrl,
  resumeUrl,
}: {
  email: string
  githubUrl: string
  resumeUrl: string
}) {
  return <NavClient email={email} githubUrl={githubUrl} resumeUrl={resumeUrl} />
}
