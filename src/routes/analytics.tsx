import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics" }] }),
  component: () => <PlaceholderPage title="Analytics" description="Insights and reports coming soon." />,
});