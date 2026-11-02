import { LoadingState } from "@/components/ui/StatePanels";

export default function Loading() {
  return (
    <div className="wrap section" aria-busy="true">
      <LoadingState label="Loading" />
    </div>
  );
}
