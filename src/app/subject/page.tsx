import SubjectPageMain from "../../../components/subjectPage/SubjectPageMain";
import { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || "http://localhost:5000";

type Props = {
  searchParams: Promise<{
    subjectCode?: string;
  }>;
};

// export async function generateMetadata({ searchParams }: Props) {
//   const { subjectCode } = await searchParams;
//   return {
//     title: subjectCode ? `${subjectCode.toUpperCase()}` : "Subject Details",
//   };
// }

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { subjectCode } = await searchParams;

  if (!subjectCode) {
    return {
      title: "Subject Details",
    };
  }

  try {
    const response = await fetch(
      `${baseUrl}/api/resource/${subjectCode}`,
      { cache: "no-store" }
    );

    if (response.ok) {
      const data = await response.json();

      return {
        title: data.subject?.name || subjectCode.toUpperCase(),
      };
    }
  } catch (error) {
    console.error(error);
  }

  return {
    title: subjectCode.toUpperCase(),
  };
}

export default async function SubjectPage({ searchParams }: Props) {
  const { subjectCode } = await searchParams;

  let resources = [];
  let subject = null;
  let departmentName = "";
  let error = null;

  if (subjectCode) {
    try {
      const response = await fetch(`${baseUrl}/api/resource/${subjectCode}`, {
        cache: "no-store",
      });
      if (response.ok) {
        const data = await response.json();
        resources = data.resources || [];
        subject = data.subject || null;
        departmentName = data.departmentName || "";
      } else {
        const errData = await response.json().catch(() => ({}));
        error = errData.message || `Subject code "${subjectCode}" not found`;
      }
    } catch (err) {
      console.error("Error fetching subject resources:", err);
      error = "Connection failed. Please ensure the backend server is running.";
    }
  } else {
    error = "No subject code specified.";
  }

  return (
    <SubjectPageMain
      resources={resources}
      subject={subject}
      departmentName={departmentName}
      error={error}
    />
  );
}