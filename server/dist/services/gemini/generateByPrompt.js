"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateByPrompt = generateByPrompt;
const gemini_1 = require("../../config/gemini");
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
async function generateByPrompt(prompt, numberOfQuestions = 20) {
    const response = await gemini_1.ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: `${SYSTEM_PROMPT} 
        Generate ${numberOfQuestions} MCQs from:
        ${prompt}`,
    });
    const text = response.text ?? "";
    return JSON.parse(text);
}
//# sourceMappingURL=generateByPrompt.js.map