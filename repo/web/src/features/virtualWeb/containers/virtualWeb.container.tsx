import Container from "@/src/common/components/Container.component";
import { Link } from "@heroui/link";
import SummaryGenerator from "../components/SummaryGenerator.component";
import VirtualWebStatistics from "../components/VirtualWebStatistics.component";


export default function VirtualWeb() {
    const virtualWebData = {
        createdAt: "2025-10-15",
        virtualDomCount: 12,
        summaryTotalConsumed: {
            input: 300,
            output: 150,
            total: 450
        },
        analysisTotalConsumed: {
            input: 120,
            output: 60,
            total: 180
        },
    };

    return (
        <Container>
            <div className="w-full flex-1 flex flex-col gap-8">
                <h1 className="text-center text-4xl md:text-5xl font-extrabold uppercase mb-6 bg-clip-text text-transparent 
               bg-gradient-to-r from-primary-600 to-secondary-500 drop-shadow-md">
                    <Link
                        isExternal
                        showAnchorIcon
                        color="foreground"
                        underline="always"
                        className="text-2xl"
                        href="https://example.com"
                    >
                        example.com
                    </Link>
                </h1>

                <div className="grid grid-cols-1 h-[500px] md:grid-cols-2 gap-6 items-start">
                    <SummaryGenerator />
                    <VirtualWebStatistics {...virtualWebData} />
                </div>
            </div>
        </Container>
    );
}