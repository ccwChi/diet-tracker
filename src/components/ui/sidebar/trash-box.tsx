"use client";

import { Spinner } from "@/components/spinnner";
import { Input } from "@/components/ui/input";
import { useCurrentUser } from "@/hooks/auth/use-current-user";

import { fetcher } from "@/lib/fetcher";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash, Undo } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { HtmlHTMLAttributes, useState } from "react";
import { toast } from "sonner";

interface TrashBoxProps {
  documentList?: Document[] | undefined;
}

const TrashBox = ({ documentList }: TrashBoxProps) => {
  const router = useRouter();
  const params = useParams();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();


  if (documentList === undefined) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <div className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          沒有找到任何文件
        </p>

      </div>
    </div>
  );
};

export default TrashBox;
