import TerminalChat from "~/components/terminal/TerminalChat";

export default async function ThreadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <TerminalChat initialThreadId={id} />;
}
