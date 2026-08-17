import { notFound } from 'next/navigation'

interface BlogPostProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params

  // Add MDX-backed blog post loading here when content files are present.
  void slug
  notFound()
}
