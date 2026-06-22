//import { notFound }
//from "next/navigation";
import { notFound } from "next/navigation";

import { blogPosts }
from "@/content/blog-posts";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function
generateMetadata({
  params,
}: Props) {

  const { slug } =
    await params;

  const post =
    blogPosts.find(
      (p) => p.slug === slug
    );

  if (!post) {
    return {};
  }

  return {
    title: post.title,

    description:
      post.description,
  };
}

export default async function
BlogDetailPage({
  params,
}: Props) {

  const { slug } =
    await params;

  const post =
    blogPosts.find(
      (p) => p.slug === slug
    );

  if (!post) {
    notFound();
  }

  return (
    <main className="container mx-auto py-16">
      <h1 className="text-4xl font-bold mb-4">
        {post.title}
      </h1>

      <p className="text-gray-500 mb-6">
        {post.publishedAt}
      </p>

      <article className="prose max-w-none">
        {post.content}
      </article>
    </main>
  );
}