"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Wine } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function MainNav() {
  // const pathname = usePathname();
  const router = useRouter();
  return (
    <div className="mr-4 hidden md:flex">
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {/* <Link href="/" className="mr-6 flex items-center space-x-2"> */}
        <div
          className="flex items-center"
          onClick={() => {
            toast.info(`Version: ${siteConfig.version}`, {
              position: "top-center",
              duration: 1500,
            });
            router.push("/");
          }}
        >
          <Wine className="h-4 w-4" />
          <span className="ml-2 hidden font-bold sm:inline-block">
            {siteConfig.name}
          </span>
        </div>

        {/* </Link> */}
        <Link
          href="/dashboard"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
        >
          Dashboard
        </Link>
        <Link
          href="/wine/*"
          className="text-foreground/60 transition-colors hover:text-foreground/80"
        >
          Wine
        </Link>

        <DropdownMenu>
          {/* <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src="" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger> */}
          <DropdownMenuTrigger className="text-foreground/60 transition-colors hover:text-foreground/80">
            <p>Cellar</p>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/bottles-search/*">
                {/* <PocketKnifeIcon className="mr-2 h-3 w-3" />  */}
                Bottles Search
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/bottles-server-pagination">
                {/* <PocketKnifeIcon className="mr-2 h-3 w-3" />  */}
                Bottles Server Pagination
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/bottles">
                {/* <PocketKnifeIcon className="mr-2 h-3 w-3" />  */}
                Bottles Client Pagination
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/consume">
                {/* <PocketKnifeIcon className="mr-2 h-3 w-3" />  */}
                Consume
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/test">
                {/* <User className="mr-2 h-4 w-4" />  */}
                Test
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>
    </div>
  );
}
