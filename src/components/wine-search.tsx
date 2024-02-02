"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Grape } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { TwoWineBottles } from "./svgs";

const WineSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleWineSearch = () => {
    // Perform search with searchTerm
    // console.log(`Searching for "${searchTerm}"...`);
    if (searchTerm) {
      const s = searchTerm;
      setSearchTerm("");
      router.push(`/wine/${s}`);
    } else
      toast.info("Please enter a wine search", {
        position: "top-center",
        duration: 1000,
      });
  };
  const handleBottleSearch = () => {
    if (searchTerm) {
      const s = searchTerm;
      setSearchTerm("");
      // router.push(`/bottles-search?search=${s}`);
      router.push(`/bottles-search/${s}`);
    } else
      toast.info("Please enter a bottle search", {
        position: "top-center",
        duration: 1000,
      });
    // router.push(`/wine/${searchTerm}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleWineSearch();
    }
  };

  return (
    <span className="flex w-full space-x-0.5">
      <Input
        type="search"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          if (e.target.value === "") {
            // Handle the input being cleared
            router.push(`/`);
          }
        }}
        onKeyDown={handleKeyDown}
      />
      <Button
        variant="outline"
        className="text-foreground/60"
        size="icon"
        onClick={handleWineSearch}
      >
        <Grape className="h-4 w-4 " />
      </Button>
      <Button
        variant="outline"
        className="text-foreground/60"
        size="icon"
        onClick={handleBottleSearch}
      >
        {/* <SearchIcon /> */}
        <TwoWineBottles className="h-4 w-4" />
      </Button>
    </span>
  );
};

function GrapeIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      // width="24"
      // height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 5V2l-5.89 5.89" />
      <circle cx="16.6" cy="15.89" r="3" />
      <circle cx="8.11" cy="7.4" r="3" />
      <circle cx="12.35" cy="11.65" r="3" />
      <circle cx="13.91" cy="5.85" r="3" />
      <circle cx="18.15" cy="10.09" r="3" />
      <circle cx="6.56" cy="13.2" r="3" />
      <circle cx="10.8" cy="17.44" r="3" />
      <circle cx="5" cy="19" r="3" />
    </svg>
  );
}

export default WineSearch;
