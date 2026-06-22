import "@/app/globals.css";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { getLocalizedBlogPosts } from "@/content/blog-posts";
import { generateSEO } from "@/lib/seo";


export const metadata = generateSEO({
  title: "Blog",
  description: "Latest insights on digital marketing, websites and business growth.",
  path: "/blog",
});

export default function BlogPage() {
  const locale = useLocale();
  
  // Hooking cleanly into your master "Blog" dictionary block
  const blogT = useTranslations("Blog");
  const posts = getLocalizedBlogPosts(locale);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="container mx-auto py-24 px-6">
        
        {/* FIX: Changed from blogT("Blog.title") to blogT("title") */}
        <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-white sm:text-5xl border-b border-slate-900 pb-4">
          {blogT("title")}
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="border border-slate-800 bg-slate-900/40 backdrop-blur-sm rounded-2xl p-6 transition-all duration-300 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between"
            >
              <div>
                <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
                  {post.title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {post.description}
                </p>
              </div>

              {/* FIX: Changed from blogT("Blog.readMore") to blogT("readMore") */}
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="inline-flex items-center text-sm font-semibold text-teal-400 hover:text-teal-300 transition-colors group mt-auto"
              >
                {blogT("readMore")}
              </Link>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
