"use client";

import { useState, useRef, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckIcon,
  MoreHorizontal,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { TestForm } from "./test-form";

export const DropdownActions = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [hasOpenDialog, setHasOpenDialog] = useState(false);
  const dropdownTriggerRef = useRef<null | HTMLButtonElement>(null);
  const focusRef = useRef<null | HTMLButtonElement>(null);

  const handleDialogItemSelect = () => {
    focusRef.current = dropdownTriggerRef.current;
  };

  const handleDialogItemOpenChange = (open: boolean) => {
    setHasOpenDialog(open);
    if (open === false) {
      setDropdownOpen(false);
    }
  };

  const dialogClose = () => {
    document.getElementById("closeDialog")?.click();
  };

  return (
    <DropdownMenu
      open={dropdownOpen}
      onOpenChange={setDropdownOpen}
      modal={false}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="xs">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        hidden={hasOpenDialog}
        onCloseAutoFocus={(event) => {
          if (focusRef.current) {
            focusRef.current.focus();
            focusRef.current = null;
            event.preventDefault();
          }
        }}
      >
        <DialogItem
          triggerChildren={
            <>
              {/* <PencilIcon className="mr-4 h-4 w-4" /> */}
              <span>Edit Project</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogTitle className="DialogTitle">Edit</DialogTitle>
          <DialogDescription className="DialogDescription">
            Edit this record below.
          </DialogDescription>
          <TestForm dialogClose={dialogClose} />
        </DialogItem>

        <DialogItem
          triggerChildren={
            <>
              <Trash2Icon className="mr-4 h-4 w-4" />
              <span>Delete Project</span>
            </>
          }
          onSelect={handleDialogItemSelect}
          onOpenChange={handleDialogItemOpenChange}
        >
          <DialogTitle className="DialogTitle">Delete</DialogTitle>
          <DialogDescription className="DialogDescription">
            Are you sure you want to delete this record?
          </DialogDescription>
        </DialogItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type Props = {
  triggerChildren: ReactNode;
  children: ReactNode;
  onSelect: () => void;
  onOpenChange: (open: boolean) => void;
};

const DialogItem = ({
  triggerChildren,
  children,
  onSelect,
  onOpenChange,
}: Props) => {
  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          className="p-3"
          onSelect={(event) => {
            event.preventDefault();
            onSelect && onSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          {children}
          <DialogClose asChild>
            <button id="closeDialog"></button>
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};
