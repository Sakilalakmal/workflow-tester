import Header from "@/components/Header";
import DesktopSideBar from "@/components/SideBar";
import { ThemeToggler } from "@/components/ThemeTrigger";
import { Separator } from "@/components/ui/separator";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <DesktopSideBar />
      <div className="flex flex-col flex-2 min-h-screen">
        <header className="flex items-center justify-between px-6 py-4 h-[50px] container">
          <Header />
          <div className="gap-1 flex items-center">
            <ThemeToggler/>
          </div>
        </header>
        <Separator />
        <div className="overflow-auto">
          <div className="flex-1 container py-4 text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default layout;
