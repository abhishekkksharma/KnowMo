import { Metadata } from "next";
import TestPageMain from "../../../../../components/subjectPage/TestPageMain";

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";

type Props = {
  params: Promise<{
    subjectCode: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { subjectCode } = await params;
  return {
    title: `Practice Test - ${subjectCode.toUpperCase()}`,
  };
}

export default async function TestPage({ params }: Props) {
  const { subjectCode } = await params;

  let questions = [];
  let error = null;
  let subjectName = subjectCode.toUpperCase();

  try {
    const response = await fetch(`${baseUrl}/api/resource/mcqs/${subjectCode}`, {
      cache: "no-store",
    });
    if (response.ok) {
      const data = await response.json();
      questions = data.data || [];
    } else {
      const errData = await response.json().catch(() => ({}));
      error = errData.message || `No MCQs found for subject "${subjectCode}".`;
    }

    // Also fetch subject details to get the name
    const subjectRes = await fetch(`${baseUrl}/api/resource/${subjectCode}`, {
      cache: "no-store",
    });
    if (subjectRes.ok) {
      const subjectData = await subjectRes.json();
      if (subjectData.subject?.name) {
        subjectName = subjectData.subject.name;
      }
    }
  } catch (err) {
    console.error("Error fetching subject MCQs:", err);
    error = "Connection failed. Please ensure the backend server is running.";
  }

  return (
    <TestPageMain 
      questions={questions} 
      subjectCode={subjectCode}
      subjectName={subjectName} 
      error={error} 
    />
  );
}
