"use client"

import * as React from "react"
import { format, isSameDay } from "date-fns"
import { th } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DateRangePickerProps {
  className?: string
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
}

export function DateRangePicker({ className, dateRange, onDateRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const formatDate = (date: Date) => {
    try {
      return format(date, "d MMM yyyy", { locale: th })
    } catch (error) {
      console.error("Date formatting error:", error)
      return date.toLocaleDateString("th-TH")
    }
  }

  const handleSelect = (range: DateRange | undefined) => {
    if (!range?.from) {
      onDateRangeChange(undefined)
      return
    }
    // If both start and end are selected and differ, close popover
    if (range.from && range.to && !isSameDay(range.from, range.to)) {
      onDateRangeChange(range)
      setTimeout(() => setIsOpen(false), 100)
    } else {
      // Only start selected (or same-day placeholder), keep open
      onDateRangeChange({ from: range.from, to: undefined })
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-10 sm:h-12 rounded-lg sm:rounded-xl border-gray-200 hover:bg-gray-50 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-200",
              !dateRange && "text-muted-foreground",
            )}
            onClick={() => setIsOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
                </>
              ) : (
                formatDate(dateRange.from)
              )
            ) : (
              <span>เลือกช่วงวันที่</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
            captionLayout="dropdown"
            locale={th}
            className="border rounded-md p-3"
          />
          <div className="flex items-center justify-between p-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDateRangeChange(undefined)
                setIsOpen(false)
              }}
              className="text-sm"
            >
              ยกเลิก
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
