import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Analysis {
    summary: string;
    keyFindings: string[];
    gaps: string[];
  }

export async function analyzePaper(text: string): Promise<Analysis> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a research paper analysis assistant. Analyze the given text and return a structured JSON object with summary, keyFindings, and gaps. Only return valid JSON, no explanations, no markdown formatting.",
          },
          {
            role: "user",
            content: `Analyze this research paper and return a JSON object with:
            - "summary": A concise summary (max 3 paragraphs).
            - "keyFindings": An array of key findings (max 5 bullet points).
            - "gaps": An array of research gaps or future work (2-3 points).
            
            Text: ${text}
            
            Ensure the response is a valid JSON object, without Markdown formatting like \`\`\`json.`,
          },
        ],
        temperature: 0.2,
      });
      
      // Extract only the JSON part from the response
      const rawContent = response.choices[0].message.content?.trim() || "";
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

      // Ensure jsonMatch is not null before parsing
      const jsonText = jsonMatch ? jsonMatch[0] : "{}";

      const result = JSON.parse(jsonText);

      return {
        summary: result.summary || "",
        keyFindings: result.keyFindings || [],
        gaps: result.gaps || [],
      };

      
    } catch (error) {
      console.error("Error analyzing paper:", error);
      throw error;
    }
  }

export async function extractMetadata(text: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Extract and structure metadata from the research paper text.",
        },
        {
          role: "user",
          content: `Extract the following metadata in JSON format:
          - title
          - authors (as array)
          - abstract
          - publicationDate (YYYY-MM-DD format if available)
          - keywords (as array)
          
          Text: ${text}`,
        },
      ],
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("Error extracting metadata:", error);
    throw error;
  }
}