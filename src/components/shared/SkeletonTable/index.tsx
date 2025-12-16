import { Skeleton } from "@/components/ui/skeleton"

export default function SekeletonTable() {
    return (
        <>
            <div className="flex w-full items-center gap-2 mb-3">
                <Skeleton className="h-7 w-[20%]" />
                <Skeleton className="h-7 w-[60%]" />
                <Skeleton className="h-7 w-[20%]" />
            </div>
            <div>
                {
                    Array.from({ length: 3 }).map((_, i) => {
                        return (
                            <Skeleton key={i} className="h-7 w-full mt-2" />
                        )
                    })
                }
            </div>
        </>
    )
}