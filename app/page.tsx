"use client"

import dynamic from "next/dynamic"
const FrontPage = dynamic(() => import("@/components/layout/frontpage"), { ssr: false });

export default function HomePage() {

  return (
    <FrontPage />
  );
}