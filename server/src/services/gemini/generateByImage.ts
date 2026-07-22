import fs from "fs";
import { ai } from "../../config/gemini";


const SYSTEM_PROMPT = `
You are an expert university professor.

Generate high quality multiple choice questions.

Rules:

- Return ONLY valid JSON.
- Do not wrap the JSON inside markdown.
- No explanation outside JSON.

Return format:

[
  {
    "question":"",
    "options":["","","",""],
    "correctAnswer":"",
    "explanation":""
  }
]

Requirements:

- Exactly 4 options.
- Only one correct answer.
- Explanation should be 1-2 lines.
- Questions should test understanding instead of memorization.
`;

export async function generateByImage(
    imagePath: string,
    numberOfQuestions = 20
) {
    const image = fs.readFileSync(imagePath);

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: [
            {
                text: `${SYSTEM_PROMPT} 
                Analyze this syllabus image.
                Generate exactly ${numberOfQuestions} MCQs.
                Ignore page numbers
                Ignore formatting
                Cover every topic equally.`,
            },
            {
                inlineData: {
                    mimeType: "image/jpeg",
                    data: image.toString("base64"),
                },
            },
        ],
    });

    const text = response.text ?? "";

    return JSON.parse(text);
}