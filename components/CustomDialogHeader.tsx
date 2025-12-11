import React from "react";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

interface CustomDialogHeaderProps {
  title?: string;
  subTitle?: string;
  icon?: LucideIcon;

  iconClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
}

function CustomDialogHeader({
  title,
  subTitle,
  icon,
  iconClassName,
  titleClassName,
  subtitleClassName,
}: CustomDialogHeaderProps) {
  const Icon = icon;
  return (
    <DialogHeader className="py-6">
      <DialogTitle asChild>
        <div className="flex flex-col items-center gap-2 mb-2">
          {Icon && <Icon size={30} className={cn("text-blue-500",iconClassName)} />}
          {title && <p className={cn("text-2xl", titleClassName)}>{title}</p>}
          {subTitle && (
            <p
              className={cn("text-sm text-muted-foreground", subtitleClassName)}
            >
              {subTitle}
            </p>
          )}
        </div>
      </DialogTitle>
      <Separator/>
    </DialogHeader>
  );
}

export default CustomDialogHeader;
