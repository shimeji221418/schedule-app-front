import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import SelectForm from "@/components/atoms/SelectForm";
import { useMessage } from "@/hooks/useMessage";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { TeamType } from "@/types/api/team";
import { EditUserType, GetUserType, LoginUserType } from "@/types/api/user";
import {
  Box,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from "@chakra-ui/react";
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
} from "firebase/auth";
import React, {
  ChangeEvent,
  FC,
  memo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  targetUser: GetUserType;
  auth: Auth;
  teams: Array<TeamType>;
  loginUser: LoginUserType;
  openPassModal: () => void;
};

const UserDetailModal: FC<Props> = memo((props) => {
  const { isOpen, onClose, targetUser, auth, teams, loginUser, openPassModal } =
    props;
  const [editUser, setEditUser] = useState<EditUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
    password: "",
  });
  const { showMessage } = useMessage();
  const { handleSubmit } = useFormContext();
  const roles = ["general", "admin"];

  useEffect(() => {
    if (targetUser) {
      setEditUser({
        ...editUser,
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email,
        uid: targetUser.uid,
        role: targetUser.role,
        teamId: targetUser.teamId,
      });
    }
  }, [targetUser, isOpen]);

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEditUser({ ...editUser, [name]: value });
    },
    [editUser, setEditUser]
  );

  // const handleEmailChange = async () => {
  //   try {
  //     if (auth.currentUser) {
  //       const credential = EmailAuthProvider.credential(
  //         auth.currentUser.email!,
  //         editUser.password
  //       );
  //       await reauthenticateWithCredential(auth.currentUser, credential);
  //       await updateEmail(auth.currentUser, editUser.email);
  //     }
  //   } catch (e: any) {
  //     console.log(e);
  //   }
  // };

  const handleOnSubmit = () => {
    const request = async () => {
      try {
        // await handleEmailChange();
        if (auth.currentUser) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email!,
            editUser.password
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updateEmail(auth.currentUser, editUser.email);
        }
        if (auth.currentUser) {
          const token = await auth.currentUser.getIdToken(true);
          const data = {
            user: {
              id: editUser.id,
              name: editUser.name,
              email: editUser.email,
              uid: editUser.uid,
              role: editUser.role,
              team_id: editUser.teamId,
            },
          };
          const props: BaseClientWithAuthType = {
            method: "patch",
            url: `/users/${editUser.id}`,
            token: token!,
            params: data,
          };
          await BaseClientWithAuth(props);
          onClose();
          location.reload();
          showMessage({ title: "更新しました", status: "success" });
        }
      } catch (e: any) {
        console.log(e);
        showMessage({ title: `${e.message}`, status: "error" });
      }
    };
    request();
  };

  const isReadOnly: boolean =
    loginUser?.id !== targetUser.id && loginUser?.role !== "admin";

  const isAdminCheck: boolean = loginUser?.role !== "admin";

  return (
    <>
      {loginUser && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader as="h1" textAlign="center">
              ユーザー詳細
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit(handleOnSubmit)}>
              <ModalBody>
                <Stack spacing={4}>
                  <InputForm
                    title="name"
                    name="name"
                    value={editUser.name}
                    type="text"
                    handleChange={handleChange}
                    message="nameを入力してください"
                    isReadOnly={isReadOnly}
                  />
                  <InputForm
                    title="email"
                    name="email"
                    value={editUser.email}
                    type="email"
                    handleChange={handleChange}
                    message="emailを入力してください"
                    isReadOnly={isReadOnly}
                  />
                  <SelectForm
                    title="team"
                    name="teamId"
                    value={editUser.teamId}
                    teams={teams}
                    handleonChange={handleChange}
                    message="teamを入力してください"
                    isDisabled={isReadOnly}
                  />
                  <SelectForm
                    roles={roles}
                    value={editUser.role}
                    title="role"
                    name="role"
                    handleonChange={handleChange}
                    message="ユーザー権限が入力されていません"
                    isDisabled={isAdminCheck}
                  ></SelectForm>
                </Stack>
              </ModalBody>

              <ModalBody>
                {!isReadOnly && (
                  <>
                    <Box mt={10}>
                      <Stack>
                        <Text as="p" textAlign="end" fontSize="xs">
                          ※ユーザー情報の更新にはパスワードが必要です
                        </Text>
                        <InputForm
                          title="password"
                          name="password"
                          type="password"
                          handleChange={handleChange}
                          message="passwordを入力してください"
                          isReadOnly={isReadOnly}
                        />
                        {!isReadOnly && (
                          <FormButton type="submit" color="yellow" size="md">
                            edit
                          </FormButton>
                        )}
                      </Stack>
                      {!isReadOnly && (
                        <Divider borderColor="gray.400" mt={4} mb={4} />
                      )}
                    </Box>
                  </>
                )}
              </ModalBody>

              <ModalFooter>
                {!isReadOnly && (
                  <PrimaryButton
                    color="green"
                    size="md"
                    onClick={openPassModal}
                  >
                    Password変更はこちら
                  </PrimaryButton>
                )}
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      )}
    </>
  );
});

export default UserDetailModal;
