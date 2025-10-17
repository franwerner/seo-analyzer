"use client"
import { BreadcrumbItem, Breadcrumbs as HerouiBreadcrumbs } from "@heroui/breadcrumbs";
import clsx from "clsx";
import { usePathname } from "next/navigation";

export default function Breadcrumbs() {
    const pathname = usePathname()
    if (pathname === "/") {
        return null
    }

    const pathSegments = pathname.split("/").filter((item) => item !== "");

    const buildPath = (index: number) => {
        return "/" + pathSegments.slice(0, index + 1).join("/");
    }

    return (
        <HerouiBreadcrumbs
            variant="solid"
            itemsAfterCollapse={2}
            itemsBeforeCollapse={1}
            maxItems={3}
            className="p-4">
            {pathSegments.map((item, index) => {
                return (
                    <BreadcrumbItem
                        key={item}
                        className={clsx(pathSegments.length === 1 && "bg-default-100")}
                        href={buildPath(index)}>
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </BreadcrumbItem>
                )
            })}
        </HerouiBreadcrumbs>
    )

}