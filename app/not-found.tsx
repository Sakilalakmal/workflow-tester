import { buttonVariants } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";
import Link from "next/link";
import React from "react";

function notFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <div className="text-center">
        <h1 className="text-7xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="text-2xl font-semibold text-muted-foreground mb-4">
          dont worry sometimes things get lost in the flow
        </p>
      </div>
      <div className="flex flex-col items-center mt-16  justify-center gap-4">
        <Link
          href={"/"}
          className={buttonVariants({
            className: "bg-linear-to-r from-blue-500 to-blue-600 w-fit",
          })}
        >
          <MoveLeft className="size-4" />
          Back to flow daddy
        </Link>

        <p className="text-sm text-muted-foreground">
          If You see this error again and again please contact support.
        </p>
      </div>
    </div>
  );
}

export default notFound;
