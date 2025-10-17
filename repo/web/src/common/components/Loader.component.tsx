import { Spinner } from "@heroui/spinner";

export default function Loader() {
    return (
        <div className="flex-1 w-full  flex justify-center items-center ">
            <Spinner color="secondary" size="lg" />
        </div>
    )
}