"use client";
import { app } from "../../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NewTeamType } from "@/types/api/team";
import { useAuthContext } from "@/provider/AuthProvider";
import { useGetTeams } from "@/hooks/useGetTeams";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useFormContext } from "react-hook-form";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import InputForm from "@/components/atoms/InputForm";
import FormButton from "@/components/atoms/FormButton";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useMessage } from "@/hooks/useMessage";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const NewTeam = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const { showMessage } = useMessage();
  const [newTeam, setNewTeam] = useState<NewTeamType>({
    name: "",
  });
  const { loginUser, loading } = useAuthContext();
  const { teams, getTeamsWithoutAuth } = useGetTeams();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewTeam({ ...newTeam, [name]: value });
    },
    [newTeam, setNewTeam]
  );

  useEffect(() => {
    getTeamsWithoutAuth();
    clearErrors();
  }, []);

  const handleonSubmit = () => {
    const createTeam = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team: { name: newTeam.name },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "post",
            url: "/teams/",
            token: token!,
            data: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          showMessage({ title: "新規作成しました", status: "success" });
          location.reload();
        }
      } catch (e: any) {
        console.log(e);
        showMessage({ title: `${e.message}`, status: "error" });
      }
    };
    createTeam();
  };

  const { handleSubmit, clearErrors } = useFormContext();
  return (
    <>
      {!loading && loginUser && loginUser!.role === "admin" ? (
        <>
          <Flex justify="center" mt={10}>
            <Box
              w="md"
              h="250px"
              bg="white"
              shadow="md"
              p={4}
              borderRadius="md"
              textAlign="center"
              mr={10}
            >
              <Heading as="h2">新チーム作成</Heading>
              <Divider my={4} borderColor="gray.400" />
              <form onSubmit={handleSubmit(handleonSubmit)}>
                <Stack spacing={4}>
                  <InputForm
                    title="チーム名"
                    name="name"
                    type="text"
                    handleChange={handleonChange}
                    message="チーム名を入力してください"
                  />

                  <FormButton type="submit" color="cyan" size="md">
                    保存
                  </FormButton>
                </Stack>
              </form>
            </Box>

            <Box
              w="xs"
              bg="white"
              shadow="md"
              p={4}
              borderRadius="md"
              textAlign="center"
            >
              <Heading as="h2">チーム一覧</Heading>
              <Divider my={4} borderColor="gray.400" />
              <Stack spacing={4}>
                {teams.map((team) => (
                  <Flex
                    align="center"
                    bg="cyan.400"
                    justify="space-between"
                    px={2}
                    py={1}
                    borderRadius="md"
                    key={team.id}
                    height="auto"
                  >
                    <Text as="h2" color="white" fontSize="lg">
                      {team.name}
                    </Text>
                    <PrimaryButton
                      size="sm"
                      color="yellow"
                      fontColor="black"
                      onClick={() => router.push(`/admin/team/edit/${team.id}`)}
                    >
                      編集
                    </PrimaryButton>
                  </Flex>
                ))}
              </Stack>
            </Box>
          </Flex>
          <Box display={"flex"} justifyContent={"center"} mt={10}>
            <PrimaryButton
              size="lg"
              color="green"
              onClick={() => {
                router.push("/admin/");
              }}
            >
              <ChevronLeftIcon />
              戻る
            </PrimaryButton>
          </Box>
        </>
      ) : (
        <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
      )}
    </>
  );
};

export default NewTeam;
