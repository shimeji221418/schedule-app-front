"use client";
import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";

const Loading = () => {
  return (
    <Flex justify="center" h="100vh" align="center">
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="cyan.500"
        size="xl"
        label="loading..."
      />
      <Text ml={1} color="gray.600">
        Loading...
      </Text>
    </Flex>
  );
};

export default Loading;
