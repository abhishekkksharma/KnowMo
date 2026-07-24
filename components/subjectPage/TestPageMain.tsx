"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle, AlertCircle, RefreshCcw, HelpCircle, Trophy, ArrowRight, Download } from "lucide-react";

export interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

interface TestPageMainProps {
  questions: MCQ[];
  subjectCode: string;
  subjectName?: string;
  error?: string | null;
}

const ITEMS_PER_PAGE = 20;

export default function TestPageMain({ questions, subjectCode, subjectName, error }: TestPageMainProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (error) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-500 border border-red-100 dark:border-red-900/50 mb-6">
          <AlertCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
          Unable to Load Test
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
          {error}
        </p>
        <Link
          href={`/subject?subjectCode=${subjectCode}`}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          <ArrowLeft size={16} />
          Back to Subject
        </Link>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-400 mb-6">
          <HelpCircle size={28} />
        </div>
        <h2 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
          No Questions Found
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-md mx-auto mb-8">
          There are no MCQs available for {subjectCode.toUpperCase()} at the moment.
        </p>
        <Link
          href={`/subject?subjectCode=${subjectCode}`}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
        >
          <ArrowLeft size={16} />
          Back to Subject
        </Link>
      </div>
    );
  }

  const handleOptionSelect = (qIndex: number, option: string) => {
    // Prevent changing answer after selection
    if (selectedAnswers[qIndex]) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: option
    }));
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalQuestions = questions.length;
  const totalPages = Math.ceil(totalQuestions / ITEMS_PER_PAGE);
  const attemptedCount = Object.keys(selectedAnswers).length;
  const correctCount = Object.entries(selectedAnswers).filter(
    ([index, answer]) => questions[parseInt(index)].correctAnswer === answer
  ).length;
  const isFinished = attemptedCount === totalQuestions && totalQuestions > 0;

  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedQuestions = questions.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const downloadTest = async () => {
    try {
      setIsDownloading(true);
      const res = await fetch('/test-template.html');
      if (!res.ok) throw new Error("Could not load template");
      let html = await res.text();

      // Replace placeholders
      html = html.replace(/__SUBJECT_NAME__/g, subjectName || subjectCode);
      html = html.replace(/__SUBJECT_CODE__/g, subjectCode);
      html = html.replace(/__QUESTIONS_DATA__/g, JSON.stringify(questions));

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${subjectCode.toUpperCase()}_Practice_Test.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download test:", error);
      alert("Failed to download the test template.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 md:py-20 min-h-[70vh]">
      {/* Logo */}
      <div className="mb-10">
        <Link
          href="https://knowmo.vercel.app/"
          target="_blank"
          className="inline-flex items-center gap-3 select-none"
        >
          <h1
            className="font-extrabold tracking-tight leading-none"
            style={{ fontSize: "28px" }}
          >
            <span className="text-zinc-500 dark:text-zinc-400">Know</span>
            <span className="text-zinc-900 dark:text-zinc-100">Mo</span>
            <span className="text-pink-600">.</span>
          </h1>
        </Link>
      </div>

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link
            href={`/subject?subjectCode=${subjectCode}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white flex items-center gap-3">
            {subjectName || "Practice Test"}
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-3 py-1 text-sm font-semibold text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
              {subjectCode.toUpperCase()}
            </span>
          </h1>
        </div>
        
        {/* Score indicator */}
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/50 px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col text-right">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Attempted</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {attemptedCount} / {totalQuestions}
            </span>
          </div>
          <div className="w-px h-8 bg-zinc-200 dark:bg-zinc-700 mx-1"></div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Score</span>
            <span className="text-sm font-bold text-green-600 dark:text-green-400">
              {correctCount}
            </span>
          </div>
          <button
            onClick={handleRestart}
            className="p-1.5 ml-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 dark:hover:text-white dark:hover:bg-zinc-800 transition-colors"
            title="Restart Test"
          >
            <RefreshCcw size={16} />
          </button>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {paginatedQuestions.map((q, localIndex) => {
          const globalIndex = startIdx + localIndex;
          const selectedAnswer = selectedAnswers[globalIndex];
          const isAnswered = !!selectedAnswer;
          const isCorrect = selectedAnswer === q.correctAnswer;

          return (
            <div 
              key={globalIndex} 
              className={`rounded-3xl border p-6 md:p-8 transition-all ${
                isAnswered 
                  ? isCorrect 
                    ? "border-green-200/60 bg-green-50/20 dark:border-green-900/20 dark:bg-green-950/5" 
                    : "border-red-200/60 bg-red-50/20 dark:border-red-900/20 dark:bg-red-950/5"
                  : "border-zinc-200 bg-white dark:border-zinc-800/80 dark:bg-zinc-950/30 hover:border-zinc-300 dark:hover:border-zinc-700"
              } shadow-sm`}
            >
              <div className="mb-6 flex gap-4">
                <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800 font-bold text-zinc-600 dark:text-zinc-300 text-sm">
                  {globalIndex + 1}
                </div>
                <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed pt-1">
                  {q.question}
                </h3>
              </div>

              <div className="space-y-3 pl-12">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedAnswer === option;
                  const isThisCorrect = q.correctAnswer === option;
                  
                  let optionClass = "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-white dark:bg-zinc-900/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80";
                  let icon = null;

                  if (isAnswered) {
                    if (isThisCorrect) {
                      optionClass = "border-green-500 bg-green-50 text-green-700 dark:border-green-500/50 dark:bg-green-950/30 dark:text-green-400 font-medium";
                      icon = <CheckCircle2 className="text-green-500" size={18} />;
                    } else if (isThisSelected) {
                      optionClass = "border-red-500 bg-red-50 text-red-700 dark:border-red-500/50 dark:bg-red-950/30 dark:text-red-400 font-medium";
                      icon = <XCircle className="text-red-500" size={18} />;
                    } else {
                      optionClass = "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50 opacity-50";
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(globalIndex, option)}
                      disabled={isAnswered}
                      className={`w-full text-left px-5 py-4 rounded-xl border flex items-center justify-between transition-all ${optionClass} ${!isAnswered ? "cursor-pointer" : "cursor-default"}`}
                    >
                      <span className="text-[15px]">{option}</span>
                      {icon}
                    </button>
                  );
                })}
              </div>

              {isAnswered && (
                <div className={`mt-6 pl-12 animate-in fade-in slide-in-from-top-2 duration-300`}>
                  <div className={`p-4 rounded-xl text-sm ${
                    isCorrect 
                      ? "bg-green-100/40 text-green-800 dark:bg-green-900/20 dark:text-green-300" 
                      : "bg-red-100/40 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                  }`}>
                    <span className="font-bold mr-2">{isCorrect ? "Correct!" : "Incorrect."}</span>
                    {q.explanation && (
                      <span className="opacity-90 leading-snug inline-block mt-1">{q.explanation}</span>
                    )}
                    {!isCorrect && !q.explanation && (
                      <span className="opacity-90 inline-block mt-1">The correct answer is <span className="font-semibold">{q.correctAnswer}</span>.</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pagination UI from user's image request */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12 mb-8">
          <div className="flex items-center gap-4 bg-zinc-200/50 dark:bg-zinc-800/50 p-1.5 rounded-full">
            <button 
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(p => p - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-full bg-white dark:bg-zinc-700 shadow-sm text-zinc-900 dark:text-white disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center w-10 h-10"
            >
              <ArrowLeft size={18} />
            </button>
            <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 px-2">
              {currentPage} of {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => {
                setCurrentPage(p => p + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-sm disabled:opacity-50 transition-all flex items-center justify-center w-10 h-10"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
      
      {/* Download Test Button (Below Pagination) */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={downloadTest}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-all hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700 disabled:opacity-50"
        >
          {isDownloading ? <RefreshCcw className="animate-spin" size={16} /> : <Download size={16} />}
          {isDownloading ? "Preparing Download..." : "Download Test as HTML"}
        </button>
      </div>

      {/* Final Result Card */}
      {isFinished && (
        <div className="mt-8 animate-in zoom-in-95 duration-500 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-black p-8 text-center shadow-lg">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-500 mb-4">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
            Test Completed!
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">
            You scored <strong className="text-zinc-900 dark:text-white">{correctCount}</strong> out of {totalQuestions}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
             <Link
               href={`/subject?subjectCode=${subjectCode}`}
               className="rounded-full border border-zinc-200 dark:border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
             >
               Return to Subject
             </Link>
             <button
               onClick={handleRestart}
               className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100 transition-colors"
             >
               Retake Test
             </button>
          </div>
        </div>
      )}
    </main>
  );
}
