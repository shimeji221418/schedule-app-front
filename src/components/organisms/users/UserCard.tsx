"use client";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { GetUserType, LoginUserType } from "@/types/api/user";
import { Box, Divider, Stack, Text } from "@chakra-ui/react";
import React, { FC, memo } from "react";

type Props = {
  user: GetUserType;
  loginUser: LoginUserType;
  onClick?: (user: GetUserType) => void;
  title?: string;
};

const UserCard: FC<Props> = memo((props) => {
  const { user, loginUser, onClick, title } = props;
  return (
    <>
      {loginUser && user && (
        <Box
          w="240px"
          bg="white"
          shadow="lg"
          borderRadius="md"
          px={4}
          py={6}
          cursor="pointer"
        >
          <Stack spacing={3} textAlign="center">
            <Text
              as="h1"
              fontSize="2xl"
              fontWeight="bold"
              color={"gray.600"}
              p={1}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {user.name}
            </Text>
            <Divider borderColor={"cyan.700"} />
            <Stack spacing={4}>
              <Text as="h1" textAlign="center">
                <Text color="cyan.700">email:</Text>
                <Text
                  fontSize="xl"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  color={"gray.600"}
                >
                  {user.email}
                </Text>
              </Text>
              <Text as="h1" textAlign="center">
                <Text color="cyan.700">team:</Text>
                <Text fontSize="2xl" fontWeight="bold" color={"gray.600"}>
                  {user.team?.name}
                </Text>
              </Text>
              {onClick && (
                <PrimaryButton
                  size="md"
                  color="red"
                  onClick={() => {
                    onClick(user);
                  }}
                >
                  {title}
                </PrimaryButton>
              )}
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
});

export default UserCard;
