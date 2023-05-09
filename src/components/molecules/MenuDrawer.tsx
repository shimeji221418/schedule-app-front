import { LoginUserType } from "@/types/api/user";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { FC, memo } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => void;
  loginUser: LoginUserType;
  admin: boolean;
};

const MenuDrawer: FC<Props> = memo((props) => {
  const { isOpen, onClose, handleLogout, loginUser, admin } = props;

  return (
    <>
      {loginUser && (
        <>
          <Drawer isOpen={isOpen} onClose={onClose} size="xs">
            <DrawerOverlay />
            <DrawerContent bg="white" opacity=".8" textAlign="center">
              <DrawerCloseButton />
              <DrawerHeader as="h1" fontSize="3xl">
                MENU
              </DrawerHeader>
              <DrawerBody fontSize="lg">
                <Stack spacing={6}>
                  <Text as="h2">Login: {loginUser.name}</Text>
                  {admin && <Link href="/admin">管理者ページ</Link>}
                  <Link href="/users">ユーザー一覧</Link>
                  <Link href="/schedules">個人スケジュール</Link>
                  <Link onClick={handleLogout}>ログアウト</Link>
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      )}
    </>
  );
});

export default MenuDrawer;
