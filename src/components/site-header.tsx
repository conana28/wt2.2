import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { dark, neobrutalism } from "@clerk/themes";
import { EnterIcon, SunIcon } from "@radix-ui/react-icons";

import { MainNav } from "@/components/main-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import WineSearch from "./wine-search";
import ProfileButton from "@/components/profile-button";
// Needed to add a button to the navbar
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { siteConfig } from "@/config/site";
import { FaNetworkWired } from "react-icons/fa";
import { SupaBase } from "./svgs";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        {/* Left end of Navbar */}
        <MainNav />
        <MobileNav />

        {/* Middle of Navbar */}

        {/* Right end of Navbar */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SignedIn>
              <WineSearch />
            </SignedIn>
            <SignedOut>Winetrak</SignedOut>
          </div>
          <div className="text-primary">
            {process.env.DATABASE_URL?.includes("supabase") ? (
              <span>
                <SupaBase className="w-4 h-4" />
              </span>
            ) : (
              <FaNetworkWired />
            )}
          </div>{" "}
          <nav className="flex items-center">
            {/* To add an icon button */}
            {/* <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                  }),
                  "w-9 px-0"
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link> */}
            <ModeToggle />
            <SignedIn>
              {/* Mount the UserButton component */}
              <div className="w-4 h-4">
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              {/* Signed out users get sign in icon */}
              <SignInButton>
                <Button variant="ghost" className="w-9 px-0">
                  {/* <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
                  {/* <EnterIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
                  <EnterIcon className=" h-[1.2rem] w-[1.2rem] " />
                  <span className="sr-only">Sign-In</span>
                </Button>
              </SignInButton>
            </SignedOut>

            {/* <ProfileButton /> */}
          </nav>
        </div>
      </div>
    </header>
  );
}
