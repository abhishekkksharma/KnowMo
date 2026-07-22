import Subject from "../../models/subject.model";
import { generateByImage } from "../gemini/generateByImage";
import { generateByPrompt } from "../gemini/generateByPrompt";

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface GenerateMcqsParams {
  subjectCode: string;
  numberOfQuestions: number;
  prompt?: string;
  imagePath?: string;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Orchestrates MCQ retrieval from the Subject's questionBank:
 * 1. Checks the existing question bank on the Subject document
 * 2. If enough MCQs exist, returns them shuffled (no Gemini call)
 * 3. If not enough, generates the deficit via Gemini (prompt or image)
 * 4. Saves newly generated MCQs to the Subject's questionBank
 * 5. Returns the combined set, shuffled
 */
export async function generateMcqs({
  subjectCode,
  numberOfQuestions,
  prompt,
  imagePath,
}: GenerateMcqsParams): Promise<MCQ[]> {
  const upperSubjectCode = subjectCode.trim().toUpperCase();

  // Step 1: Find the subject and check existing question bank
  const subject = await Subject.findOne({
    subjectCode: upperSubjectCode,
  }).select("questionBank");

  if (!subject) {
    throw new Error(`Subject with code '${upperSubjectCode}' not found.`);
  }

  const existingQuestions: MCQ[] = (subject.questionBank as MCQ[] | undefined) ?? [];

  // Step 2: If we have enough, just shuffle and return
  if (existingQuestions.length >= numberOfQuestions) {
    return shuffle([...existingQuestions]).slice(0, numberOfQuestions);
  }

  // Step 3: Not enough — generate the deficit from Gemini
  const deficit = numberOfQuestions - existingQuestions.length;

  if (!prompt && !imagePath) {
    // No generation source provided — return whatever we have
    if (existingQuestions.length > 0) {
      return shuffle([...existingQuestions]);
    }
    throw new Error("No existing MCQs found and no prompt or image provided to generate new ones.");
  }

  let generatedMcqs: MCQ[];

  if (imagePath) {
    generatedMcqs = await generateByImage(imagePath, deficit);
  } else {
    generatedMcqs = await generateByPrompt(prompt!, deficit);
  }

  // Step 4: Save newly generated MCQs to the Subject's questionBank
  await Subject.findOneAndUpdate(
    { subjectCode: upperSubjectCode },
    {
      $push: {
        questionBank: {
          $each: generatedMcqs,
        },
      },
    }
  );

  // Step 5: Return combined set, shuffled
  const combined = [...existingQuestions, ...generatedMcqs];
  return shuffle(combined).slice(0, numberOfQuestions);
}
