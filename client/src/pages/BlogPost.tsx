import { Link, useParams } from "react-router-dom";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { getPostBySlug } from "@/data/blogPosts";
import NotFound from "@/pages/NotFound";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <NotFound />;
  }

  return (
    <PageShell title={post.title} subtitle={`${post.date} · ${post.readTime}`}>
      <div className="max-w-none">
        {post.body.map((para, i) => (
          <p key={i} className="text-muted-foreground leading-relaxed mb-4">
            {para}
          </p>
        ))}
      </div>
      <Button variant="outline" className="mt-8" asChild>
        <Link to="/blogs">Back to blogs</Link>
      </Button>
    </PageShell>
  );
};

export default BlogPost;
