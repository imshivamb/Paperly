'use client';

import { pdfjs } from 'react-pdf';
import '@/lib/pdf-config';

export async function extractPdfText(pdfUrl: string | null): Promise<string | undefined> {
  if (!pdfUrl) return undefined;

  try {
    const loadingTask = pdfjs.getDocument(pdfUrl);
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      /* eslint-disable  @typescript-eslint/no-explicit-any */
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    return undefined;
  }
}
