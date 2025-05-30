
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

import { useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

interface MenuProps {
  documentId: string;
}

const Menu = ({ documentId }: MenuProps) => {
  const router = useRouter();
  const user = useCurrentUser();
  const queryClient = useQueryClient();


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem>
          <Trash className="w-4 h-4 mr-2" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <div className="text-xs text-muted-foreground p-2">
          Last edited by: {user?.name}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Menu;

Menu.Skeletion = function MenuSkeleton() {
  return <Skeleton className="w-10 h-10"></Skeleton>;
};
