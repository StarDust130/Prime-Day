"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Home from "@/components/pages/Home";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem("primeDayUserId");

    if (userId) {
      router.replace("/dashboard");
    }
  }, [router]);

  return <Home />;
};

export default Page;