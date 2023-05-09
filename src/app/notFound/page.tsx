"use client";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const NotFound = () => {
  const router = useRouter();
  return (
    <>
      <Text as="h1">Page NotFound</Text>
      <PrimaryButton onClick={() => router.push("/")} color="cyan" size="md">
        ホームへ
      </PrimaryButton>
    </>
  );
};

export default NotFound;
