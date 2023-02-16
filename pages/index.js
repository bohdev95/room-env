import React, { useEffect } from "react";
import HomePage from "./homePage";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { hasToken } from "../lib/checkUser";

const MainPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session?.user?.email) {
      router.replace("/login");
    }
  });
  return <HomePage />;
};
//  <HomePage />
export default MainPage;
