import Link from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <Button>
        <Link href="/thread/new">New Thread</Link>
      </Button>
    </div>
  );
}
