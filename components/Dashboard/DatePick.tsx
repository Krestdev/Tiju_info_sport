"use client";

import * as React from "react";
import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerWithRangeProps {
  onChange?: (date: DateRange | undefined) => void;
  show: boolean;
}

export function DatePick({ onChange, show }: DatePickerWithRangeProps) {
  const [date, setDate] = React.useState<DateRange | undefined>();

  return (
    <div className={cn("grid gap-2")}>
      <Popover >
        <PopoverTrigger asChild className="w-fit z-50">
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-fit h-[40px] font-ubuntu rounded-none justify-start text-left font-normal", !date && "text-muted-foreground")}
          >
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              show && <span>Filtrer par date</span>
            )}
            <CalendarIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 z-50" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              setDate(newDate);
              if (onChange) onChange(newDate); 
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
