import { notFound } from 'next/navigation'

interface BlogPostProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params

  // TODO: Load MDX content from content/blog/{slug}.mdx
  void slug
  notFound()
}
