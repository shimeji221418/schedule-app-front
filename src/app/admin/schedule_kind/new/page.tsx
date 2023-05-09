"use client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { app } from "../../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useAuthContext } from "@/provider/AuthProvider";
import { TaskType } from "@/types/api/schedule_kind";
import { useGetTasks } from "@/hooks/useGetTasks";
import { useRouter } from "next/navigation";
import { useMessage } from "@/hooks/useMessage";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const Newtask = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const { showMessage } = useMessage();
  const [newTask, setNewTask] = useState<TaskType>({
    name: "",
    color: "",
  });
  const { loginUser } = useAuthContext();
  const { tasks, getTask } = useGetTasks({ auth, loginUser });

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewTask({ ...newTask, [name]: value });
    },
    [newTask, setNewTask]
  );

  useEffect(() => {
    getTask();
  }, []);

  const handleonSubmit = () => {
    const createScheduleKind = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            schedule_kind: { name: newTask.name, color: newTask.color },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "post",
            url: "/schedule_kinds/",
            token: token!,
            data: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          showMessage({ title: "新規作成しました", status: "success" });
          location.reload();
        }
      } catch (e: any) {
        console.log(e.response);
        showMessage({
          title: `${e.message}`,
          status: "error",
        });
      }
    };
    createScheduleKind();
  };

  const { handleSubmit } = useFormContext();
  return (
    <>
      {loginUser && loginUser!.role === "admin" ? (
        <>
          <Flex justify="center" mt={10}>
            <Box
              w="md"
              bg="white"
              shadow="md"
              p={4}
              borderRadius="md"
              textAlign="center"
              mr={10}
            >
              <Heading as="h1">新インデックス作成</Heading>
              <Divider my={4} borderColor="gray.400" />
              <form onSubmit={handleSubmit(handleonSubmit)}>
                <Stack spacing={3}>
                  <InputForm
                    title="ジャンル名"
                    name="name"
                    type="text"
                    handleChange={handleonChange}
                    message="スケジュールのジャンル名を入力してください"
                  />
                  <InputForm
                    title="カラー"
                    name="color"
                    type="text"
                    handleChange={handleonChange}
                    message="カラーを入力してください"
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
              <Heading as="h2">インデックス一覧</Heading>
              <Divider my={4} borderColor="gray.400" />
              <Stack spacing={4}>
                {tasks.map((task) => (
                  <Flex
                    align="center"
                    bg={task.color}
                    justify="space-between"
                    px={2}
                    py={1}
                    borderRadius="md"
                    key={task.id}
                    height="auto"
                  >
                    <Text as="h2" fontSize={"lg"}>
                      {task.name}
                    </Text>
                    <Button
                      size="sm"
                      padding={1}
                      textAlign="center"
                      bg={task.color}
                      color="black"
                      onClick={() =>
                        router.push(`/admin/schedule_kind/edit/${task.id}`)
                      }
                    >
                      編集
                    </Button>
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

export default Newtask;
