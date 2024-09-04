"use client";
import {
  BaseClientWithoutAuth,
  BaseClientWithoutAuthType,
} from "@/lib/api/client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import SelectForm from "@/components/atoms/SelectForm";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { Box, Flex, Heading, Stack } from "@chakra-ui/react";
import { app } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { NewUserType } from "@/types";
import { useFormContext } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/provider/AuthProvider";
import { useGetTeams } from "@/hooks/useGetTeams";
import { useMessage } from "@/hooks/useMessage";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { ChevronLeftIcon } from "@chakra-ui/icons";

const SignUp = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const { teams, getTeamsWithoutAuth } = useGetTeams();
  const [newUser, setNewUser] = useState<NewUserType>({
    name: "",
    email: "",
    password: "",
    role: "general",
    team_id: 0,
  });
  const { loginUser } = useAuthContext();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setNewUser({ ...newUser, [name]: value });
    },
    [newUser, setNewUser]
  );

  const { handleSubmit } = useFormContext();
  const { showMessage } = useMessage();
  const handleonSubmit = () => {
    const request = async () => {
      await handleSignUp();
      if (auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true);
          const data = { token, role: newUser.role, team_id: newUser.team_id };
          const params: BaseClientWithoutAuthType = {
            method: "post",
            url: "/auth/registrations/",
            data: data,
          };
          await BaseClientWithoutAuth(params);
          router.push("/");
          showMessage({ title: "新規登録しました", status: "success" });
          console.log(auth.currentUser);
        } catch (e: any) {
          console.log(e);
        }
      }
    };
    request();
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(
        auth,
        newUser.email,
        newUser.password
      );
      await updateProfile(auth.currentUser!, {
        displayName: newUser.name,
      });
      console.log(auth.currentUser?.displayName);
    } catch (e: any) {
      console.log(e);
      showMessage({ title: `${e.message}`, status: "error" });
    }
  };

  useEffect(() => {
    getTeamsWithoutAuth();
  }, []); // 初回のみデータ取得

  useEffect(() => {
    if (teams.length > 0 && newUser.team_id === 0) {
      // 追加: team_idが未設定の場合のみ
      setNewUser((prev) => ({ ...prev, team_id: teams[0].id }));
    }
  }, [teams]); // teamsが変更されたときにのみ実行

  return (
    <>
      {loginUser == null && (
        <>
          <Flex justify="center" align="center" h="80vh">
            <Box
              w="sm"
              bg="white"
              borderRadius="lg"
              shadow="lg"
              px={6}
              pt={6}
              pb={8}
            >
              <Stack spacing={6}>
                <Heading as="h1" fontSize="3xl" textAlign="center">
                  SignUp
                </Heading>
                <form onSubmit={handleSubmit(handleonSubmit)}>
                  <Stack spacing={3}>
                    <InputForm
                      name="name"
                      title="name"
                      type="text"
                      handleChange={handleChange}
                      message="nameが入力されていません"
                    />
                    <InputForm
                      name="email"
                      title="email"
                      type="email"
                      handleChange={handleChange}
                      message="emailが入力されていません"
                    />
                    <SelectForm
                      teams={teams}
                      value={newUser.team_id}
                      title="select team"
                      name="team_id"
                      handleonChange={handleChange}
                      message="所属チームが入力されていません"
                    />

                    <InputForm
                      name="password"
                      title="password"
                      type="password"
                      handleChange={handleChange}
                      message="passwordが入力されていません"
                    />
                    <FormButton type="submit" color="cyan" size="md">
                      SignUp
                    </FormButton>
                  </Stack>
                </form>
              </Stack>
            </Box>
          </Flex>
          <Box display={"flex"} justifyContent={"center"} mt={"-60px"}>
            <PrimaryButton
              size="lg"
              color="green"
              onClick={() => {
                router.push("/login/");
              }}
            >
              <ChevronLeftIcon />
              戻る
            </PrimaryButton>
          </Box>
        </>
      )}
    </>
  );
};

export default SignUp;
