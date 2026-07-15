import Link from "next/link";

import { getLocalizedBlogPosts } from "@/content/blog-posts";

interface FeaturedPostsProps {
  locale?: string;
}

export default function FeaturedPosts({
  locale = "en",
}: FeaturedPostsProps) {
  const featured = getLocalizedBlogPosts(locale).slice(0, 3);

  return (
    <section className="py-16">
      <h2 className="mb-8 text-3xl font-bold">
        Latest Articles
      </h2>

      <div className="grid gap-6">
        {featured.map((post) => (
          <Link
            key={post.slug}
            href={`/${locale}/blog/${post.slug}`}
            className="rounded border p-6"
          >
            <h3 className="font-bold">
              {post.title}
            </h3>

            <p className="mt-2">
              {post.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}





