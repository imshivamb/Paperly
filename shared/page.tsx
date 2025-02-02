// import { Metadata } from "next";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/db";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { PapersList } from "@/components/papers/papers-list";
// import {
//   FoldersList,
//   type FolderType,
// } from "@/components/folders/folders-list";

// export const metadata: Metadata = {
//   title: "Shared | Paperly",
//   description: "View papers and folders shared with you",
// };

// export default async function SharedPage() {
//   const session = await getServerSession(authOptions);

//   const sharedFolders = await prisma.sharedFolder.findMany({
//     where: {
//       ownerId: session?.user?.id,
//     },
//     include: {
//       papers: true,
//       _count: {
//         select: {
//           papers: true,
//         },
//       },
//     },
//   });

//   const formattedFolders: FolderType[] = sharedFolders.map((folder) => ({
//     id: folder.id,
//     name: folder.name,
//     createdAt: folder.createdAt.toISOString(),
//     updatedAt: folder.updatedAt.toISOString(),
//     userId: folder.ownerId,
//     shareLink: folder.shareLink,
//     _count: {
//       papers: folder.papers.length,
//     },
//     papers: folder.papers.map((paper) => ({
//       id: paper.id,
//       title: paper.title,
//       authors: paper.authors,
//       publicationDate: paper.publicationDate?.toISOString() ?? null,
//       pdfUrl: paper.pdfUrl,
//       isStarred: paper.isStarred,
//       labels: [],
//     })),
//   }));

//   return (
//     <div className="flex flex-col gap-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Shared</h1>
//         <p className="text-muted-foreground">
//           View papers and folders shared with you
//         </p>
//       </div>

//       <Tabs defaultValue="folders" className="space-y-4">
//         <TabsList>
//           <TabsTrigger value="folders">Shared Folders</TabsTrigger>
//           <TabsTrigger value="papers">Shared Papers</TabsTrigger>
//         </TabsList>
//         <TabsContent value="folders" className="space-y-4">
//           {sharedFolders.length === 0 ? (
//             <Card>
//               <CardHeader>
//                 <CardTitle>No shared folders</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground">
//                   No folders have been shared with you yet.
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             <FoldersList folders={formattedFolders} isShared />
//           )}
//         </TabsContent>
//         <TabsContent value="papers" className="space-y-4">
//           <Card>
//             <CardContent className="p-0">
//               <PapersList isShared />
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
