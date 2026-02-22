import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-8 pb-10 animate-in fade-in duration-500">
            <div className="flex flex-col gap-3">
                <Skeleton className="h-10 w-[200px] sm:w-[300px] rounded-xl" />
                <Skeleton className="h-5 w-[250px] sm:w-[400px] rounded-xl" />
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-4">
                <Skeleton className="h-[300px] rounded-2xl lg:col-span-2" />
                <Skeleton className="h-[300px] rounded-2xl" />
            </div>

            <div className="mt-8">
                <Skeleton className="h-8 w-[150px] mb-4 rounded-xl" />
                <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                    <Skeleton className="h-14 rounded-xl" />
                </div>
            </div>
        </div>
    )
}
