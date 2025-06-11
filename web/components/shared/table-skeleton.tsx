import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function TableSkeleton({ rows = 8, columns = 5, className }: TableSkeletonProps) {
  return (
    <div className="rounded-md border bg-white">
      <Table className={className ?? "min-w-[1200px]"}>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {Array.from({ length: columns }).map((_, index) => (
              <TableHead key={`header-skel-${index}`}>
                <Skeleton className="h-5 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={`row-skel-${rowIndex}`}>
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <TableCell key={`cell-skel-${rowIndex}-${cellIndex}`}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
