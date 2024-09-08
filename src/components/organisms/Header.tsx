"use client";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Text,
  textDecoration,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { FC, memo, useCallback } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { getAuth, signOut } from "firebase/auth";
import { app } from "../../../firebase";
import MenuDrawer from "../molecules/MenuDrawer";
import MenuIconButton from "../atoms/menuIconButton";
import { useAuthContext } from "@/provider/AuthProvider";
import Link from "next/link";
import PrimaryButton from "../atoms/PrimaryButton";
import { useMessage } from "@/hooks/useMessage";

const Header: FC = memo(() => {
  const router = useRouter();
  const auth = getAuth(app);
  const { loginUser } = useAuthContext();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const admin: boolean = loginUser?.role === "admin";
  const { showMessage } = useMessage();
  const handleLogout = async () => {
    await signOut(auth).then(() => {
      router.push("/login");
      showMessage({ title: "ログアウトしました", status: "info" });
    });
  };
  return (
    <>
      {loginUser && (
        <>
          <Flex
            bg="cyan.500"
            p={{ base: 1, md: 2 }}
            align="center"
            justify="space-between"
            width="100%"
          >
            <Tooltip bg="gray.500" fontWeight="bold" label="ホーム画面へ">
              <Heading
                as="h1"
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="bold"
                color="white"
              >
                <Link href="/">
                  <Text _hover={{ textDecoration: "underline" }}>
                    Schedule-app
                  </Text>
                </Link>
              </Heading>
            </Tooltip>

            <Flex color="white" align="center">
              <HStack spacing={6} display={{ base: "none", md: "flex" }}>
                {admin && (
                  <Link href="/admin">
                    <Text
                      fontWeight={"bold"}
                      _hover={{ textDecoration: "underline" }}
                    >
                      管理者ページ
                    </Text>
                  </Link>
                )}
                <Link href="/users">
                  <Text
                    fontWeight={"bold"}
                    _hover={{ textDecoration: "underline" }}
                  >
                    ユーザー一覧
                  </Text>
                </Link>
                <Link href="/schedules">
                  <Text
                    fontWeight={"bold"}
                    _hover={{ textDecoration: "underline" }}
                  >
                    個人スケジュール
                  </Text>
                </Link>
                {/* <Link onClick={handleLogout}>ログアウト</Link> */}
                <PrimaryButton onClick={handleLogout} color="blue" size="sm">
                  ログアウト
                </PrimaryButton>
              </HStack>
              <Box ml={4}>
                <MenuIconButton onOpen={onOpen} />
              </Box>
            </Flex>
          </Flex>
          <MenuDrawer
            isOpen={isOpen}
            onClose={onClose}
            handleLogout={handleLogout}
            loginUser={loginUser}
            admin={admin}
          />
        </>
      )}
    </>
  );
});

export default Header;
