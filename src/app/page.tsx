// import Container from "@/components/ui/container";
import Image from "next/image";

export default function Home() {
  return (
    <div
      className="container mt-2 mx-auto"
      style={{ position: "relative", height: "90vh" }}
    >
      <Image
        src="/bordeaux82.jpeg"
        alt="Vercel Logo"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: "cover",
        }}
      />
    </div>
  );
}
