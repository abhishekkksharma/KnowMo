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
 * Orchestrates MCQ generation and storage:
 * 1. Generates new MCQs via Gemini (prompt or image)
 * 2. Appends newly generated MCQs to the Subject's questionBank
 * 3. Returns the newly generated MCQs, shuffled
 */
export async function generateMcqs({
  subjectCode,
  numberOfQuestions,
  prompt,
  imagePath,
}: GenerateMcqsParams): Promise<MCQ[]> {
  const upperSubjectCode = subjectCode.trim().toUpperCase();

  // Step 1: Check if subject exists
  const subject = await Subject.findOne({
    subjectCode: upperSubjectCode,
  }).select("_id"); // just verify existence

  if (!subject) {
    throw new Error(`Subject with code '${upperSubjectCode}' not found.`);
  }

  if (!prompt && !imagePath) {
    throw new Error("No prompt or image provided to generate new MCQs.");
  }

  // Step 2: Generate all requested questions from Gemini
  let generatedMcqs: MCQ[];

  if (imagePath) {
    generatedMcqs = await generateByImage(imagePath, numberOfQuestions);
  } else {
    generatedMcqs = await generateByPrompt(prompt!, numberOfQuestions);
  }

  // Step 3: Save newly generated MCQs to the Subject's questionBank (append)
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

  // Step 4: Return the newly generated MCQs, shuffled
  return shuffle(generatedMcqs);
}
