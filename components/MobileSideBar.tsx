import {
  Coins,
  HamburgerIcon,
  HomeIcon,
  Layers2,
  Lock,
  MenuIcon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import Logo from "./Logo";
import Link from "next/link";

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

function MobileSideBar() {
  const [open, isOpen] = useState(false);
  const pathName = usePathname();
  const activeRoute = routes.find((route) => pathName?.includes(route.href));

  return (
    <div className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet open={open} onOpenChange={isOpen}>
          <SheetTitle>Menu</SheetTitle>
          <SheetTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <MenuIcon size={4} />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="w-[400px] sm:w-[540px] space-y-4"
            side="left"
          >
            <Logo />
            <div className="flex flex-col items-center gap-1">
              {routes.map((route) => (
                <Link
                  href={route.href}
                  key={route.label}
                  className={buttonVariants({
                    variant:
                      activeRoute?.href === route.href
                        ? "sidebarActive"
                        : "outline",
                    className: " justify-start mb-2 w-[300px]",
                  })}
                  onClick={() => isOpen((prev) => !prev)}
                >
                  <route.icons size={20} />
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}

export default MobileSideBar;
