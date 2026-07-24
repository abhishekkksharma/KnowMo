"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateMcqs = generateMcqs;
const subject_model_1 = __importDefault(require("../../models/subject.model"));
const generateByImage_1 = require("../gemini/generateByImage");
const generateByPrompt_1 = require("../gemini/generateByPrompt");
/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
function shuffle(array) {
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
async function generateMcqs({ subjectCode, numberOfQuestions, prompt, imagePath, }) {
    const upperSubjectCode = subjectCode.trim().toUpperCase();
    // Step 1: Check if subject exists
    const subject = await subject_model_1.default.findOne({
        subjectCode: upperSubjectCode,
    }).select("_id"); // just verify existence
    if (!subject) {
        throw new Error(`Subject with code '${upperSubjectCode}' not found.`);
    }
    if (!prompt && !imagePath) {
        throw new Error("No prompt or image provided to generate new MCQs.");
    }
    // Step 2: Generate all requested questions from Gemini
    let generatedMcqs;
    if (imagePath) {
        generatedMcqs = await (0, generateByImage_1.generateByImage)(imagePath, numberOfQuestions);
    }
    else {
        generatedMcqs = await (0, generateByPrompt_1.generateByPrompt)(prompt, numberOfQuestions);
    }
    // Step 3: Save newly generated MCQs to the Subject's questionBank (append)
    await subject_model_1.default.findOneAndUpdate({ subjectCode: upperSubjectCode }, {
        $push: {
            questionBank: {
                $each: generatedMcqs,
            },
        },
    });
    // Step 4: Return the newly generated MCQs, shuffled
    return shuffle(generatedMcqs);
}
//# sourceMappingURL=generateMcqs.js.map