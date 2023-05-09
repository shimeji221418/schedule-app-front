"use client";
import theme from "@/theme/theme";
import { ChakraProvider } from "@chakra-ui/react";
import React, { FC, ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const LayoutProvider: FC<Props> = ({ children }) => {
  return (
    <>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </>
  );
};

export default LayoutProvider;
