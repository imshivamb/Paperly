import { PapersList } from "@/components/papers/papers-list";
import { PapersToolbar } from "@/components/papers/papers-toolbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Papers | Paperly",
  description: "Manage your research papers",
};

export default async function PapersPage() {
  return (
    <div className="flex flex-col gap-5">
      <PapersToolbar />
      <PapersList />
    </div>
  );
}
