import type { Metadata } from "next";
import Blogs from "@/components/layouts/Blogs";
import Opener from "@/components/ui/Opener";

export const metadata: Metadata = {
  title: "Insights | Shanvia Tech",
  description: "Thinking, notes and case observations from the Shanvia Tech team.",
};

export default function BlogsPage() {
  return (
    <>
      <Opener crumbs={[{ label: "Insights" }]} title="Insights" lede="Publish what you think. Notes from the studio." />
      <Blogs showHeading={false} />
    </>
  );
}
