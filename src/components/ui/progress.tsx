import * as React from "react";

import { cn } from "@/lib/utils";

function Progress({
  value = 0,
  className,
  ...props
}: React.ComponentProps<"div"> & { value?: number }) {
  const widthClass =
    value >= 90
      ? "w-[90%]"
      : value >= 80
        ? "w-[80%]"
        : value >= 70
          ? "w-[70%]"
          : value >= 60
            ? "w-[60%]"
            : value >= 50
              ? "w-[50%]"
              : value >= 40
                ? "w-[40%]"
                : value >= 30
                  ? "w-[30%]"
                  : value >= 20
                    ? "w-[20%]"
                    : value >= 10
                      ? "w-[10%]"
                      : "w-0";

  return (
    <div
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-secondary",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all",
          widthClass,
        )}
      />
    </div>
  );
}

export { Progress };
