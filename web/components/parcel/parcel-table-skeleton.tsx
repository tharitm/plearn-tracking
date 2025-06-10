import { Skeleton } from "@/components/ui/skeleton";

export function ParcelTableSkeleton() {
  const numRows = 8; // Display 8 skeleton rows
  const numCells = 10; // Assume around 10 columns for the skeleton

  return (
    <div className="rounded-md border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="border-b bg-gray-50">
              {Array.from({ length: numCells }).map((_, index) => (
                <th
                  key={`header-skel-${index}`}
                  className="px-3 sm:px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-900"
                >
                  <Skeleton className="h-5 w-24" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: numRows }).map((_, rowIndex) => (
              <tr key={`row-skel-${rowIndex}`} className="border-b hover:bg-gray-50">
                {Array.from({ length: numCells }).map((_, cellIndex) => (
                  <td
                    key={`cell-skel-${rowIndex}-${cellIndex}`}
                    className="px-3 sm:px-4 py-3 text-xs sm:text-sm"
                  >
                    <Skeleton className="h-5 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
