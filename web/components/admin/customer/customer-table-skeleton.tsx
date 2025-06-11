import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CustomerTableSkeleton() {
  const numRows = 8; // Number of skeleton rows to display
  const numCells = 4; // Number of columns: Name, Email, Status, Actions

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: numCells }).map((_, index) => (
              <TableHead key={`header-skel-${index}`}>
                <Skeleton className="h-5 w-full" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: numRows }).map((_, rowIndex) => (
            <TableRow key={`row-skel-${rowIndex}`}>
              {Array.from({ length: numCells }).map((_, cellIndex) => (
                <TableCell key={`cell-skel-${rowIndex}-${cellIndex}`}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
