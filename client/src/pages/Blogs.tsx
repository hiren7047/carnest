import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";
import { useAppPath } from "@/hooks/useAppPath";

const Blogs = () => (
  <PageShell
    title="Blogs"
    subtitle="Guides and updates on premium cars, financing, and ownership in India."
  >
    <ul className="space-y-6">
      {blogPosts.map((post) => (
        <BlogPostItem key={post.slug} post={post} />
      ))}
    </ul>
  </PageShell>
);

function BlogPostItem({ post }: { post: (typeof blogPosts)[number] }) {
  const postPath = useAppPath(`/blogs/${post.slug}`);

  return (
    <li>
      <article className="rounded-xl border border-border/50 bg-card p-6 hover:border-secondary/40 transition-colors">
        <p className="text-xs text-muted-foreground mb-2">
          {post.date} · {post.readTime}
        </p>
        <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
          <Link to={postPath} className="hover:text-secondary transition-colors">
            {post.title}
          </Link>
        </h2>
        <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
        <Link to={postPath} className="text-sm font-medium text-secondary hover:underline">
          Read more
        </Link>
      </article>
    </li>
  );
}

export default Blogs;
