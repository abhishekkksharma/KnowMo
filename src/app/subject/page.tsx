import Card from "../../../components/subjectPage/ResourceCard";
import { Notebook } from "lucide-react";


type Props = {
  searchParams: Promise<{
    subjectCode?: string;
  }>;
};

export default async function SubjectPage({ searchParams }: Props) {
  const { subjectCode } = await searchParams;

  return (
    <h1>
      <div>
        <h1></h1>
      </div>
      <Card
        title="Notes"
        description="These are notes"
        href="/"
        icon={Notebook}
      />
      Subject Page: {subjectCode}
    </h1>
  );
}