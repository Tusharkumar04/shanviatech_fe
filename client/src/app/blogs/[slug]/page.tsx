import { Metadata } from "next";
import BlogDetails from "@/components/layouts/BlogDetails";
import { getBlogStaticParams } from "@/utils/staticParams";
import { fetchBlogData, generateBlogMetadata } from "@/utils/seoMetadata";

interface BlogDetailsPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = true;

export async function generateStaticParams() {
  return getBlogStaticParams();
}

export async function generateMetadata({ params }: BlogDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;

  try {
    const blog = await fetchBlogData(slug);

    if (!blog) {
      return {
        title: "Blog Not Found | Shanvia Tech",
        description: "The blog you are looking for could not be found.",
      };
    }

    return generateBlogMetadata(blog);
  } catch (error) {
    console.error(`Error generating metadata for blog ${slug}:`, error);
    return {
      title: "Blog | Shanvia Tech",
      description: "Shanvia Tech provides modern web development, mobile app development, and digital solutions.",
    };
  }
}

export default async function BlogDetailsPage({ params }: BlogDetailsPageProps) {
  const { slug } = await params;
  const blog = await fetchBlogData(slug);

  return <BlogDetails slug={slug} initialBlog={blog} />;
}
