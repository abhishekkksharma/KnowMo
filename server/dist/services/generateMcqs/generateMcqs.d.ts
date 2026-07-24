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
 * Orchestrates MCQ generation and storage:
 * 1. Generates new MCQs via Gemini (prompt or image)
 * 2. Appends newly generated MCQs to the Subject's questionBank
 * 3. Returns the newly generated MCQs, shuffled
 */
export declare function generateMcqs({ subjectCode, numberOfQuestions, prompt, imagePath, }: GenerateMcqsParams): Promise<MCQ[]>;
export {};
//# sourceMappingURL=generateMcqs.d.ts.map