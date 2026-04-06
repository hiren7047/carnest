import { PageShell } from "@/components/PageShell";
import { Link } from "react-router-dom";
import { blogPosts } from "@/data/blogPosts";

const Blogs = () => (
  <PageShell
    title="Blogs"
    subtitle="Guides and updates on premium cars, financing, and ownership in India."
  >
    <ul className="space-y-6">
      {blogPosts.map((post) => (
        <li key={post.slug}>
          <article className="rounded-xl border border-border/50 bg-card p-6 hover:border-secondary/40 transition-colors">
            <p className="text-xs text-muted-foreground mb-2">
              {post.date} · {post.readTime}
            </p>
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              <Link to={`/blogs/${post.slug}`} className="hover:text-secondary transition-colors">
                {post.title}
              </Link>
            </h2>
            <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
            <Link
              to={`/blogs/${post.slug}`}
              className="text-sm font-medium text-secondary hover:underline"
            >
              Read more
            </Link>
          </article>
        </li>
      ))}
    </ul>
  </PageShell>
);

export default Blogs;
