"use client";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import InputForm from "@/components/atoms/InputForm";
import { GetTaskType } from "@/types/api/schedule_kind";
import FormButton from "@/components/atoms/FormButton";
import { useFormContext } from "react-hook-form";
import { getAuth } from "firebase/auth";
import { app } from "../../../../../../firebase";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import DeleteModal from "@/components/organisms/modal/deleteModal";
import Loading from "@/app/loading";
import { useMessage } from "@/hooks/useMessage";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const EditTask = ({ params }: { params: { id: number } }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const { showMessage } = useMessage();
  const { loginUser, loading } = useAuthContext();
  const [editTask, setEditTask] = useState<GetTaskType>({
    id: 0,
    name: "",
    color: "",
  });
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { handleSubmit, clearErrors } = useFormContext();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEditTask({ ...editTask, [name]: value });
    },
    [editTask, setEditTask]
  );
  const handleonSubmit = () => {
    const editScheduleKind = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = {
          schedule_kind: { name: editTask.name, color: editTask.color },
          user_id: loginUser?.id,
        };
        const props: BaseClientWithAuthType = {
          method: "patch",
          url: `/schedule_kinds/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        router.push("/admin/schedule_kind/new");
        showMessage({ title: "更新しました", status: "success" });
      } catch (e: any) {
        console.log(e);
        showMessage({ title: `${e.message}`, status: "error" });
      }
    };
    editScheduleKind();
  };

  const handleDelete = async () => {
    try {
      if (loginUser) {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "delete",
          url: `/schedule_kinds/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        CloseDeleteModal();
        router.push("/");
        showMessage({ title: "削除しました", status: "info" });
      }
    } catch (e: any) {
      console.log(e);
      showMessage({ title: `${e.message}`, status: "error" });
    }
  };

  const OpenDeleteModal = useCallback(() => {
    setIsDeleteModal(true);
  }, []);

  const CloseDeleteModal = useCallback(() => {
    setIsDeleteModal(false);
  }, []);

  useEffect(() => {
    const getTask = async () => {
      try {
        if (loginUser && params) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: `/schedule_kinds/${params.id}`,
            token: token!,
            params: data,
          };
          if (loginUser.role === "admin") {
            const res = await BaseClientWithAuth(props);
            setEditTask(res.data);
          } else {
            console.log("権限がありません");
          }
        }
      } catch (e: any) {
        console.log(e);
        router.push("/notFound/");
      }
    };
    getTask();
    clearErrors();
  }, []);

  return (
    <>
      {editTask.id == params.id ? (
        <>
          {!loading && loginUser!.role === "admin" ? (
            <>
              <Flex justify="center">
                <Box
                  w={"md"}
                  bg="white"
                  shadow="md"
                  borderRadius={"md"}
                  p={6}
                  mt={20}
                >
                  <Heading as="h1" textAlign="center" mb={2}>
                    インデックス編集
                  </Heading>
                  <Stack spacing={8}>
                    <form onSubmit={handleSubmit(handleonSubmit)}>
                      <Stack spacing={3}>
                        <InputForm
                          title="ジャンル名"
                          name="name"
                          type="text"
                          handleChange={handleonChange}
                          value={editTask.name}
                          message="スケジュールのジャンル名を入力してください"
                        />
                        <InputForm
                          title="カラー"
                          name="color"
                          type="text"
                          handleChange={handleonChange}
                          value={editTask.color}
                          message="カラーを入力してください"
                        />
                        <FormButton type="submit" color="cyan" size="md">
                          Edit
                        </FormButton>
                      </Stack>
                    </form>
                    <Divider borderColor={"gray.400"} />
                    <PrimaryButton
                      onClick={OpenDeleteModal}
                      size="md"
                      color="red"
                    >
                      Delete
                    </PrimaryButton>
                  </Stack>
                </Box>
              </Flex>
              <Box display={"flex"} justifyContent={"center"} mt={10}>
                <PrimaryButton
                  size="lg"
                  color="green"
                  onClick={() => {
                    router.push("/admin/schedule_kind/new");
                  }}
                >
                  <ChevronLeftIcon />
                  戻る
                </PrimaryButton>
              </Box>

              <DeleteModal
                isOpen={isDeleteModal}
                onClose={CloseDeleteModal}
                handleDelete={handleDelete}
              />
            </>
          ) : (
            <>
              <Text>アクセス権限がありません。ホーム画面の遷移します。</Text>
            </>
          )}
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default EditTask;
