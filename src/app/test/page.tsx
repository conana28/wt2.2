import React from "react";
import { UserButton } from "@clerk/nextjs";
import { DropdownActions } from "./dropdown-actions";

const page = async () => {
  return (
    <div className="container mt-2">
      <h1>Session details</h1>
      {/* <pre>{JSON.stringify(session, null, 2)}</pre> */}
      <UserButton afterSignOutUrl="/" />
      <div className="mt-4">
        <DropdownActions />
      </div>
    </div>
  );
};

export default page;
