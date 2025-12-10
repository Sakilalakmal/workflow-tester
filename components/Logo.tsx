import { cn } from "@/lib/utils";
import { SquareDashedMousePointerIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

function Logo({
  fontSize = "2xl",
  iconSize = 20,
}: {
  fontSize?: string;
  iconSize?: number;
}) {
  return (
    <Link
      href={"/"}
      className={cn(
        "text-2xl font-extrabold flex items-center gap-2",
        fontSize
      )}
    >
      <div className="rounded-xl bg-linear-to-r from-blue-500 to-blue-600 p-2">
        <SquareDashedMousePointerIcon size={iconSize} className="text-white" />
      </div>

      <div className="bg-linear-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent">
            Flow
            <span>daddy</span>
      </div>
    </Link>
  );
}

export default Logo;
