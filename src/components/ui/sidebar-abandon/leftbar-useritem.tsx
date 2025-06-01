"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { ChevronsLeftRight } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";

const UserItem = () => {
  const user = useCurrentUser();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
        >
          <div className="gap-x-2 flex items-center max-w-[150px]">
            <Avatar className="h-5 w-5">
              {/* 這邊應該要有預設圖片讓他抓不到圖片的時候，自動生成並帶入，需要再建立帳號的時候就判定 */}
              {user?.image ? <AvatarImage src={user?.image || ""} /> : "🚮"}
            </Avatar>
            <span className="text-start font-medium line-clamp-1">
              {user?.name} &apos;s Note
            </span>
          </div>
          <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80"
        align="start"
        alignOffset={11}
        forceMount
      >
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium leading-none text-muted-foreground">
            {user?.email
              ? user?.email
              : "OAuthProvider : " }
          </p>
          <a className="flex items-center gap-x-2" href="/settings">
            <div className="roumd bg-secondary ">
              <Avatar className="h-full w-full">
                {user?.image ? <AvatarImage src={user?.image || ""} /> : "🚮"}
              </Avatar>
            </div>
            <div className="space-y-1">
              <p className="text-sm line-clamp-1">{user?.name} &apos;s Note</p>
            </div>
          </a>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
        
         Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserItem;
