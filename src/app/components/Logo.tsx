"use client";

import Logo from "@/app/assets/logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LogoComponent() {
  const router = useRouter();

  return (
    <Image
      style={{
        cursor: "pointer",
        transition: "transform 0.3s ease-in-out",
      }}
      src={Logo}
      alt="logo"
      width={100}
      onClick={() => router.push("/")}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  );
}
