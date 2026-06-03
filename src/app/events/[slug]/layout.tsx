import { events } from "@/lib/data/events";

export function generateStaticParams() {
  return events.map((event) => ({
    slug: event.slug,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
