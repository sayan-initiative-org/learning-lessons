import { ClipboardList } from "lucide-react";
import { PlaceholderPage } from "../components/PlaceholderPage";

export function PrioritiesLedgerPage() {
  return (
    <PlaceholderPage
      title="Priorities Ledger"
      subtitle="Today's task list — what to focus on, in priority order"
      Icon={ClipboardList}
    />
  );
}
