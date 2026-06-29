import { notFound } from "next/navigation";

import { getLocalizedBlogPosts } from "@/content/blog-posts";

interface Props {
  params: Promise<{
    locale: string;
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: Props) {
  const { locale, slug } = await params;

  const post = getLocalizedBlogPosts(locale).find(
    (post) => post.slug === slug
  );

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogDetailPage({
  params,
}: Props) {
  const { locale, slug } = await params;

  const post = getLocalizedBlogPosts(locale).find(
    (post) => post.slug === slug
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto py-16">
      <h1 className="mb-4 text-4xl font-bold">
        {post.title}
      </h1>

      <article className="prose max-w-none">
        <p>{post.description}</p>
      </article>
    </main>
  );
}