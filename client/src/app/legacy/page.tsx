import Opener from "@/components/ui/Opener";
import { EmptyState } from "@/components/ui/StatePanels";

export default function LegacyPage() {
  return (
    <>
      <Opener crumbs={[{ label: "Legacy" }]} title="Legacy" />
      <section className="section section--bone">
        <div className="wrap">
          <EmptyState title="Nothing here." text="This page has no content." />
        </div>
      </section>
    </>
  );
}
