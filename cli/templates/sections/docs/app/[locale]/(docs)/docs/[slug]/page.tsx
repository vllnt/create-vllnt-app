import { notFound } from 'next/navigation'

interface DocPageProps {
  params: Promise<{ slug: string }>
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params

  // TODO: Load MDX content from content/docs/{slug}.mdx
  void slug
  notFound()
}
