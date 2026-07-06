import SubjectMain from "../../../../components/subjects/SubjectsMain";

type Props = {
  params: Promise<{
    department: string;
  }>;
};

export async function generateMetadata({ params }: Props) {
  const { department } = await params;

  return {
    title: department.toUpperCase(),
  };
}

export default async function Page({ params }: Props) {
  const { department } = await params;

  return <SubjectMain departmentCode={department} />;
}