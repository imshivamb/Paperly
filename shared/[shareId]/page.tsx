// import { notFound } from "next/navigation";
// import { prisma } from "@/lib/db";
// import {
//   PapersList,
//   type PaperListItem,
// } from "@/components/papers/papers-list";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Folder } from "lucide-react";

// interface SharedFolderPageProps {
//   params: Promise<{
//     shareId: string;
//   }>;
// }

// async function getSharedFolder(shareId: string) {
//   const folder = await prisma.sharedFolder.findUnique({
//     where: {
//       shareLink: shareId,
//     },
//     include: {
//       papers: {
//         include: {
//           labels: true,
//         },
//       },
//       owner: {
//         select: {
//           name: true,
//           email: true,
//         },
//       },
//     },
//   });

//   return folder;
// }

// export async function generateMetadata({ params }: SharedFolderPageProps) {
//   const resolvedParams = await params;
//   const folder = await getSharedFolder(resolvedParams.shareId);
//   if (!folder) return { title: "Not Found" };

//   return {
//     title: `${folder.name} | Shared Folder`,
//     description: `Shared folder by ${folder.owner.name || folder.owner.email}`,
//   };
// }

// export default async function SharedFolderPage({
//   params,
// }: SharedFolderPageProps) {
//   const resolvedParams = await params;
//   const folder = await getSharedFolder(resolvedParams.shareId);
//   if (!folder) notFound();

//   // Map the papers to the correct format
//   const mappedPapers: PaperListItem[] = folder.papers.map((paper) => ({
//     id: paper.id,
//     title: paper.title,
//     authors: paper.authors,
//     publicationDate: paper.publicationDate?.toISOString() ?? null,
//     pdfUrl: paper.pdfUrl,
//     isStarred: paper.isStarred,
//     labels: paper.labels.map((label) => ({
//       id: label.id,
//       name: label.name,
//       color: label.color,
//     })),
//   }));

//   return (
//     <div className="container mx-auto py-8 space-y-6">
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Folder className="h-6 w-6" />
//             <div>
//               <CardTitle>{folder.name}</CardTitle>
//               <CardDescription>
//                 Shared by {folder.owner.name || folder.owner.email}
//               </CardDescription>
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <PapersList papers={mappedPapers} isShared />
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
