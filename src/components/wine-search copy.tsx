"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SearchIcon } from "lucide-react";

import { Input } from "./ui/input";
import { Button } from "./ui/button";

const WineSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    // Perform search with searchTerm
    // console.log(`Searching for "${searchTerm}"...`);
    router.push(`/wine/${searchTerm}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <span className="flex">
      <Input
        type="search"
        placeholder="Wine search"
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
        onClick={handleSearch}
      >
        <SearchIcon />
      </Button>
    </span>
  );
};

export default WineSearch;
