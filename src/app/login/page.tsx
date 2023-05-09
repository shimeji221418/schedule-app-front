"use client";
import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import { useMessage } from "@/hooks/useMessage";
import { useAuthContext } from "@/provider/AuthProvider";
import { SignonUserType } from "@/types";
import { Box, Divider, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { app } from "../../../firebase";

const Login = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const [signonUser, setSignonUser] = useState<SignonUserType>({
    email: "",
    password: "",
  });
  const { showMessage } = useMessage();
  const { handleSubmit } = useFormContext();
  const { userCheck, setUserCheck } = useAuthContext();
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setSignonUser({ ...signonUser, [name]: value });
    },
    [signonUser, setSignonUser]
  );

  const handleonSubmit = async () => {
    try {
      await signInWithEmailAndPassword(
        auth,
        signonUser.email,
        signonUser.password
      );
      router.push("/");
      showMessage({ title: "ログインしました", status: "success" });
      setUserCheck(!userCheck);
    } catch (e: any) {
      console.log(e);
      showMessage({ title: `${e.message}`, status: "error" });
    }
  };

  return (
    <>
      <Flex justify="center" align="center" h="100vh">
        <Box w="sm" bg="white" borderRadius="lg" shadow="lg" px={4} py={6}>
          <Stack spacing={6}>
            <Heading as="h1" fontSize="3xl" textAlign="center">
              Login
            </Heading>
            <form onSubmit={handleSubmit(handleonSubmit)}>
              <Stack spacing={4}>
                <InputForm
                  name="email"
                  title="email"
                  type="email"
                  handleChange={handleChange}
                  message="emailが入力されていません"
                />
                <InputForm
                  name="password"
                  title="password"
                  type="password"
                  handleChange={handleChange}
                  message="passwordが入力されていません"
                />
                <FormButton type="submit" color="cyan" size="md">
                  Login
                </FormButton>
              </Stack>
            </form>
          </Stack>
          <Divider borderColor="gray.400" mt={10} />
          <Box textAlign="center" mt={4}>
            <Text>アカウントをお持ちでない方はこちらから</Text>
            <Link href={"/signup"}>
              <Text
                color="cyan.500"
                textDecoration="underline"
                fontSize="lg"
                mt={2}
              >
                新規登録
              </Text>
            </Link>
          </Box>
        </Box>
      </Flex>
    </>
  );
};

export default Login;
