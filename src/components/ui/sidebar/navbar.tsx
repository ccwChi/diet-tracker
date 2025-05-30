"use client";

import { MenuIcon } from "lucide-react";

import NavbarTitle from "./navbar-title";
import Banner from "./navbar-banner";
import Menu from "./navbar-menu";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
  document?: Document | undefined | null;
}

const Navbar = ({ isCollapsed, onResetWidth, document }: NavbarProps) => {
  if (document === undefined) {
    return (
      <nav className="bg-background px-3 py-2 w-full flex items-center gap-x-4  justify-between">
        <NavbarTitle.Skeleton />
        <div className="flex items-center gap-x-2">
          <Menu.Skeletion />
        </div>
      </nav>
    );
  }

  if (document === null) {
    return null;
  }

  return (
    <>
      <nav className="bg-transparent px-3 py-2 w-full flex items-center gap-x-4">
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={onResetWidth}
            className="w-6 h-6 text-muted-foreground"
          />
        )}
        <div className="flex items-center justify-end w-full">
          <div className="flex items-center mx-4">
           
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
