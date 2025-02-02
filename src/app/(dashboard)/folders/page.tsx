import { Metadata } from "next";
import { FoldersList } from "@/components/folders/folders-list";

export const metadata: Metadata = {
  title: "Folders | Paperly",
  description: "Manage your paper folders",
};

export default async function FoldersPage() {
  return (
    <div className="flex flex-col gap-6">
      <FoldersList />
    </div>
  );
}
