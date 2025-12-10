"use client";

import { Coins, HomeIcon, Layers2, Lock } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { usePathname } from "next/navigation";

const routes = [
  {
    href: "/",
    label: "Home",
    icons: HomeIcon,
  },
  {
    href: "workflows",
    label: "workflows",
    icons: Layers2,
  },
  {
    href: "credentials",
    label: "Credentials",
    icons: Lock,
  },
  {
    href: "billing",
    label: "Billing",
    icons: Coins,
  },
];

const DesktopSideBar = () => {
  const pathName = usePathname();
  const activeRoute = routes.find((route) => pathName?.includes(route.href));

  return (
    <div className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center border-b border-separate p-4 gap-2">
        <Logo />
      </div>
      <div className="p-2">
        credentials user:
      </div>
      <div className="flex flex-col p-2">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.label}
            className={buttonVariants({
              variant:
                activeRoute?.href === route.href ? "sidebarActive" : "outline",
              className: "justify-start mb-2 w-full",
            })}
          >
            <route.icons size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DesktopSideBar;
