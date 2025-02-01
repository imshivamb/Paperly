"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Paper } from "@prisma/client";

interface PaperAnalysisProps {
  paper: Paper;
  pdfText?: string;
}

interface Analysis {
  summary: string;
  keyFindings: string[];
  gaps: string[];
}

export function PaperAnalysis({ paper, pdfText }: PaperAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(
    paper.aiSummary
      ? {
          summary: paper.aiSummary,
          keyFindings: paper.aiKeyFindings,
          gaps: paper.aiGaps,
        }
      : null
  );

  const analyzeText = async () => {
    if (!pdfText) {
      console.error("No text available for analysis");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`/api/papers/${paper.id}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: pdfText }),
      });

      if (!response.ok) throw new Error("Failed to analyze paper");

      const data = await response.json();
      setAnalysis({
        summary: data.aiSummary,
        keyFindings: data.aiKeyFindings,
        gaps: data.aiGaps,
      });
    } catch (error) {
      console.error("Error analyzing paper:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysis && !isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis</CardTitle>
          <CardDescription>
            Get an AI-powered summary and key findings from this paper
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={analyzeText} disabled={!pdfText}>
            <Sparkles className="mr-2 h-4 w-4" />
            Analyze with AI
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isAnalyzing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analyzing Paper</CardTitle>
          <CardDescription>
            Please wait while we analyze the paper
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Analysis
        </CardTitle>
        <CardDescription>
          Last analyzed:{" "}
          {paper.analyzedAt
            ? new Date(paper.analyzedAt).toLocaleString()
            : "Never"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <h3 className="font-semibold">Summary</h3>
          <div className="text-sm text-muted-foreground">
            {analysis?.summary}
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Key Findings</h3>
          <ul className="list-disc pl-4 text-sm text-muted-foreground">
            {analysis?.keyFindings.map((finding, i) => (
              <li key={i}>{finding}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold">Research Gaps</h3>
          <ul className="list-disc pl-4 text-sm text-muted-foreground">
            {analysis?.gaps.map((gap, i) => (
              <li key={i}>{gap}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
