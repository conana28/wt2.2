"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

export default function Page() {
  const [go, setGo] = useState(false);
  if (go) {
    redirect("sign-in");
  }

  return (
    <div className="container mt-10 flex justify-center">
      <div className="text-xl">
        Sign up is not available
        <div className="container mt-4 flex justify-center">
          <Button onClick={() => setGo(true)}>Return to Login</Button>
        </div>
      </div>
    </div>
  );
}
