import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="container mt-2 flex justify-center">
      <SignIn />
    </div>
  );
}
