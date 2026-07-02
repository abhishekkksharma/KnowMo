type Props = {
  searchParams: Promise<{
    subjectCode?: string;
  }>;
};

export default async function SubjectPage({ searchParams }: Props) {
  const { subjectCode } = await searchParams;

  return (
    <h1>
      Subject Page: {subjectCode}
    </h1>
  );
}