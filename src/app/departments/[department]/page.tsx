import SubjectMain from "../../../../components/subjects/SubjectsMain";

type Props = {
  params: Promise<{
    department: string;
  }>;
};

export default async function Page({
  params,
}: {
  params: Promise<{ department: string }>;
}) {
  const { department } = await params;

  return <SubjectMain departmentCode={department} />;
}