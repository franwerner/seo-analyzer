import { redirect } from "next/navigation";

export default async function VirtualDomAnalysesPage({
    params,
}: {
    params: Promise<{ virtualWebId: string; virtualDomId: string }>;
}) {
    const { virtualWebId, virtualDomId } = await params;

    redirect(`/virtualWeb/${virtualWebId}/virtualDom/${virtualDomId}`);
}