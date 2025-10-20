import { VirtualWeb } from "@seo-analyzer/common"
import { memo } from "react"
import Link from "next/link"
import { Button } from "@heroui/button"
import { Link as HLink } from "@heroui/link"
import { Tooltip } from "@heroui/tooltip"

const VirtualWebCard = memo(({ web }: { web: VirtualWeb }) => {
    return (
        <li
            key={web.id}
            className="flex justify-between  w-full h-full border border-b-2 border-default-300 items-center  rounded-lg py-4 px-4 shadow-sm transition-all"
        >
            <div className="flex gap-1 overflow-hidden flex-col">
                <Tooltip color="foreground" content={web.host}>
                    <HLink
                        color="foreground"
                        showAnchorIcon
                        underline="hover"
                        isExternal
                        href={`http://${web.host}`}
                        className="text-lg uppercase font-semibold"
                    >
                        <span className="truncate">
                            {web.host}
                        </span>
                    </HLink>
                </Tooltip>
                <span className="text-sm text-gray-500">
                    Main Pathname: {web.virtualWebConfig.virtualDom.pathname}
                </span>
                <span className="text-sm text-gray-600">
                    It has {web.virtualDomCount} Virtual dom
                </span>
            </div>

            <Link href={`/virtualWeb/${web.id}`}>
                <Button
                    color="secondary"
                    size="sm"
                    className="text-sm font-medium"
                    variant="flat"
                >
                    Go to panel
                </Button>
            </Link>
        </li>
    )
})

export default VirtualWebCard