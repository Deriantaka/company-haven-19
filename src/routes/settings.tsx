import { createFileRoute } from "@tanstack/react-router";
import { PlaceholderPage } from "@/components/PlaceholderPage";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings" }] }),
  component: () => <PlaceholderPage title="Settings" description="Preferences and configuration." />,
});