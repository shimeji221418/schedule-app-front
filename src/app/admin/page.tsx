"use client";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useAuthContext } from "@/provider/AuthProvider";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

const Admin = () => {
  const { loginUser, loading } = useAuthContext();
  const router = useRouter();
  return (
    <>
      {!loading && loginUser && loginUser!.role === "admin" ? (
        <Flex align="center" justify="center" mt={20}>
          <Box w="lg" bg="white" borderRadius="md" shadow="md" p={5}>
            <Heading as="h1" fontSize="3xl" textAlign="center">
              管理者メニュー
            </Heading>
            <Divider my={4} borderColor="gray.400" />
            <Stack spacing={5}>
              <PrimaryButton
                onClick={() => {
                  router.push("/admin/user/");
                }}
                size="lg"
                color="cyan"
              >
                ユーザー削除
              </PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  router.push("/admin/team/new");
                }}
                size="lg"
                color="cyan"
              >
                新チーム作成
              </PrimaryButton>
              <PrimaryButton
                onClick={() => {
                  router.push("/admin/schedule_kind/new");
                }}
                size="lg"
                color="cyan"
              >
                スケジュールインデックス作成
              </PrimaryButton>
            </Stack>
          </Box>
        </Flex>
      ) : (
        <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
      )}
    </>
  );
};

export default Admin;
