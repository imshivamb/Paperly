import { Label, Note, Paper, Highlight as PrismaHighlight } from "@prisma/client";


export interface ExtendedPaper extends Paper {
  labels: Label[];
  highlights: PrismaHighlight[];
  notes: Note[];
  aiSummary: string | null;
  aiKeyFindings: string[];
  aiGaps: string[];
  analyzedAt: Date | null;
}