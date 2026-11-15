import { getArchiveEntries } from "@/lib/corpus";
import TimelineClient from "./TimelineClient";

export default function TimelinePage() {
  return <TimelineClient allEntries={getArchiveEntries()} />;
}
