import Link from "next/link"
import { Link as HLink } from "@heroui/link"

export default function TitleUrl({ url }: { url: string }) {
    return (
        <h1 className="text-center  text-4xl md:text-5xl font-extrabold uppercase drop-shadow-md">
            <HLink
                isExternal
                showAnchorIcon
                color="foreground"
                underline="always"
                className="text-2xl"
                as={Link}
                href={`https://${url}`}>
                {url}
            </HLink>
        </h1>
    )
}