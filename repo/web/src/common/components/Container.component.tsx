import clsx from "clsx";
import { ComponentPropsWithoutRef, ElementType } from "react";


type ContainerProps<T extends ElementType = "div"> = {
    as?: T;
    className?: string;
} & ComponentPropsWithoutRef<T>;

export default function Container<T extends ElementType = "div">({
    as,
    className = "",
    ...props
}: ContainerProps<T>) {
    const Component = as || "div"
    return <Component className={clsx(
        "px-4 flex-1 max-w-7xl w-full mx-auto flex  flex-col",
        className
    )} {...props} />
}