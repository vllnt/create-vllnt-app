import { notFound } from 'next/navigation'

interface DocPageProps {
  params: Promise<{ slug: string }>
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params

  // Add MDX-backed docs page loading here when content files are present.
  void slug
  notFound()
}
