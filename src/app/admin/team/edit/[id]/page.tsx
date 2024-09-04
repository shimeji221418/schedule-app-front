"use client";
import { app } from "../../../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { TeamType } from "@/types/api/team";
import { useFormContext } from "react-hook-form";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import InputForm from "@/components/atoms/InputForm";
import FormButton from "@/components/atoms/FormButton";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import DeleteModal from "@/components/organisms/modal/deleteModal";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Loading from "@/app/loading";
import { useMessage } from "@/hooks/useMessage";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const EditTeam = ({ params }: { params: { id: number } }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const { showMessage } = useMessage();
  const { loginUser, loading } = useAuthContext();
  const [editTeam, setEditTeam] = useState<TeamType>({
    id: 0,
    name: "",
  });
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { handleSubmit, clearErrors } = useFormContext();

  const handleonChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEditTeam({ ...editTeam, [name]: value });
    },
    [editTeam, setEditTeam]
  );

  useEffect(() => {
    const getTeam = async () => {
      try {
        if (loginUser && params) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: `/teams/${params.id}`,
            token: token!,
            params: data,
          };
          if (loginUser.role === "admin") {
            const res = await BaseClientWithAuth(props);
            setEditTeam(res.data);
          } else {
            console.log("権限がありません");
          }
        }
      } catch (e: any) {
        console.log(e);
        router.push("/notFound");
      }
    };
    getTeam();
    clearErrors();
  }, []);
  const handleonSubmit = () => {
    const updateTeam = async () => {
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team: { name: editTeam.name },
            user_id: loginUser.id,
          };
          const props: BaseClientWithAuthType = {
            method: "patch",
            url: `/teams/${params.id}`,
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          router.push("/admin/team/new");
          showMessage({ title: "更新しました", status: "success" });
        }
      } catch (e: any) {
        console.log(e);
        showMessage({ title: `${e.message}`, status: "error" });
      }
    };
    updateTeam();
  };

  const handleDelete = async () => {
    try {
      if (loginUser) {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "delete",
          url: `/teams/${params.id}`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        console.log(res.data);
        CloseDeleteModal();
        router.push("/admin/team/new");
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
  return (
    <>
      {editTeam.id == params.id ? (
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
                    チーム編集
                  </Heading>
                  <Stack spacing={8}>
                    <form onSubmit={handleSubmit(handleonSubmit)}>
                      <Stack spacing={2}>
                        <InputForm
                          title="チーム名"
                          name="name"
                          type="text"
                          handleChange={handleonChange}
                          value={editTeam.name}
                          message="チーム名を入力してください"
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
                    router.push("/admin/team/new");
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

export default EditTeam;
