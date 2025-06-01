"use client";

import { ElementRef, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { useCurrentUser } from "@/hooks/auth/use-current-user";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface NavbarTitleProps {
  initialData: Document;
}

// 目前沒用

const NavbarTitle = ({ initialData }: NavbarTitleProps) => {
  const inputRef = useRef<ElementRef<"input">>(null);
  const queryClient = useQueryClient();

  const [title, setTitle] = useState(initialData.title);
  const [isEditing, setIsEditing] = useState(false);


  return (
    <div className="flex items-center gap-x-1 bg-transparent">
    </div>
  );
};

export default NavbarTitle;

NavbarTitle.Skeleton = function NavbarTitleSkeleton() {
  return <Skeleton className="h-9 w-16 rounded-md" />;
};
