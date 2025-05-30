"use client";

import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import { useMediaQuery } from "usehooks-ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { cn } from "@/lib/utils";
import { fetcher } from "@/lib/fetcher";

import UserItem from "./leftbar-useritem";

import { toast } from "sonner";
import {
  ChevronLeft,
  MenuIcon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import TrashBox from "./trash-box";
import Navbar from "./navbar";
import Item from "./leftbar-item";



const Navigation = () => {
  const params = useParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [isClient, setIsClient] = useState(false);

  const isResizingRef = useRef(false);
  const sidebarRef = useRef<ElementRef<"aside">>(null);
  const navbarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleCreate = () => {
    const title = null;
    const parentDocument = null;
  };

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
    setIsCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    event.stopPropagation();
    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;
    let newWidth = event.clientX - 60;

    if (newWidth < 240) newWidth = 240;
    if (newWidth > 480) newWidth = 480;

    if (sidebarRef.current && navbarRef.current) {
      sidebarRef.current.style.width = `${newWidth}px`;
      navbarRef.current.style.setProperty("left", `calc(${newWidth}px + 60px)`);
      navbarRef.current.style.setProperty(
        "width",
        `calc(100% - (${newWidth}px) - 60px)`
      );
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.width = isMobile ? "100%" : "240px";

      navbarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : `calc(100% - 300px)`
      );
      navbarRef.current.style.setProperty("left", isMobile ? "0" : `300px`);

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sidebarRef.current.style.width = "0";
      navbarRef.current.style.setProperty("width", `calc(100% - 60px)`);
      navbarRef.current.style.setProperty("left", isMobile ? "0" : `60px`);

      setTimeout(() => setIsResetting(false), 300);
    }
  };
  useEffect(() => {
    setIsClient(true);
    console.log("isMobile", isMobile);
  }, [isMobile]);
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn(
          "group/sidebar h-full bg-background overflow-y-auto relative flex flex-col z-[250] w-60 overflow-hidden",
          isResetting && "transition-all ease-in-out duration-300",
          isClient && isMobile && "w-0"
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isClient && isMobile && "opacity-100",
            isCollapsed && "hidden"
          )}
        >
          <ChevronLeft className="h-6 w-6" />
        </div>
        <div>
          <div className="ml-3 pt-4">
            
          </div>
    
          <Item onClick={handleCreate} label="New Page" icon={PlusCircle} />
        </div>
        <div className="mt-4">
          <Item onClick={handleCreate} label="Add a Page" icon={Plus} />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent side={isMobile ? "bottom" : "right"}>
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>
        <div
          onMouseDown={(event) => {
            if (isCollapsed) return;
            handleMouseDown(event);
          }}
          onClick={() => {
            if (isCollapsed) return;
            resetWidth();
          }}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navbarRef}
        className={cn(
          "absolute top-0 z-[250] left-[300px] w-[calc(100%-300px)]",
          isResetting && "transition-all ease-in-out duration-300",
          isClient && isMobile && "!w-full"
        )}
      >
        {!!params.documentId ? (
          <Navbar
            isCollapsed={isCollapsed}
            onResetWidth={resetWidth}
          />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
