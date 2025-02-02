export interface Label {
    id: string;
    name: string;
    color: string;
  }
  
  export interface Paper {
    id: string;
    title: string;
    authors: string[];
    abstract: string | null;
    pdfUrl: string | null;
    sourceUrl: string | null;
    publicationDate: string | null;  
    isStarred: boolean;
    labels: Label[];
    aiSummary: string | null;
    aiKeyFindings: string[];
    aiGaps: string[];
    analyzedAt: string | null;  
    createdAt: string;         
    updatedAt: string;         
  }
  
  export interface PapersListProps {
    initialPapers?: Paper[];
    isShared?: boolean;
  }
  
  export interface FolderType {
    id: string;
    name: string;
    createdAt: string;        
    updatedAt: string;        
    _count: {
      papers: number;
    };
    papers?: Paper[];
    shareLink?: string | null;
    ownerId?: string;
  }
  
  export interface FoldersListProps {
    initialFolders?: FolderType[];
    isShared?: boolean;
  }