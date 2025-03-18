"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { cn } from "@/lib/utils";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root ref={ref} className={cn("overflow-hidden", className)} {...props}>
    <ScrollAreaPrimitive.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
  </ScrollAreaPrimitive.Root>
));

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

export { ScrollArea };


interface ScrollBarProps {
  orientation?: "vertical" | "horizontal";
}

const ScrollBar: React.FC<ScrollBarProps> = ({ orientation = "vertical" }) => {
  return (
    <div
      className={`absolute ${
        orientation === "vertical" ? "right-0 top-0 h-full w-2" : "bottom-0 left-0 w-full h-2"
      } bg-gray-300 rounded-full opacity-50 hover:opacity-100 transition-opacity`}
    />
  );
};

export {ScrollBar};

