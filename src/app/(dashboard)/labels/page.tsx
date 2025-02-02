import { Metadata } from "next";
import { LabelsList } from "@/components/labels/labels-list";
import { LabelCreateDialog } from "@/components/labels/label-create-dialog";

export const metadata: Metadata = {
  title: "Labels | Paperly",
  description: "Manage your paper labels",
};

export default async function LabelsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">

      </div>
      <LabelsList />
    </div>
  );
}
