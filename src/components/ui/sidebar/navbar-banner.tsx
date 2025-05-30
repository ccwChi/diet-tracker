"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useCurrentUser } from "@/hooks/auth/use-current-user";
import { Button } from "@/components/ui/button";

interface BannerProps {
  documentId: string;
}

const Banner = ({ documentId }: BannerProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const onClick = (id: string) => {};


  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>This page is in the Trash</p>
      <Button
        size="sm"
        variant="outline"
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
      >
        Restore page
      </Button>

    </div>
  );
};

export default Banner;
