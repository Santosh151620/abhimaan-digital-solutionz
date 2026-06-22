import Link from "next/link";

import { blogPosts }
from "@/content/blog-posts";

export default function
FeaturedPosts() {

  const featured =
    blogPosts.slice(0, 3);

  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold mb-8">
        Latest Articles
      </h2>

      <div className="grid gap-6">
        {featured.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="border p-6 rounded"
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
