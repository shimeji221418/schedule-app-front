import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useMessage } from "@/hooks/useMessage";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { LoginUserType } from "@/types/api/user";
import {
  Box,
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
import React, { ChangeEvent, FC, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  loginUser: LoginUserType;
  auth: Auth;
};

type EmailandPassword = {
  password: string;
  email: string;
};

const EditEmailModal: FC<Props> = (props) => {
  const { isModalOpen, onClose, auth, loginUser } = props;
  const [emailAndPassword, setEmailAndPassword] = useState<EmailandPassword>({
    password: "",
    email: "",
  });
  const { handleSubmit } = useFormContext();
  const { showMessage } = useMessage();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setEmailAndPassword({ ...emailAndPassword, [name]: value });
    },
    [emailAndPassword, setEmailAndPassword]
  );

  const handleOnSubmit = () => {
    const request = async () => {
      try {
        if (auth.currentUser) {
          const credential = EmailAuthProvider.credential(
            auth.currentUser.email!,
            emailAndPassword.password
          );
          await reauthenticateWithCredential(auth.currentUser, credential);
          await updateEmail(auth.currentUser, emailAndPassword.email);
        }
        if (auth.currentUser && loginUser) {
          const token = await auth.currentUser.getIdToken(true);
          const data = {
            user: {
              email: emailAndPassword.email,
            },
          };
          const props: BaseClientWithAuthType = {
            method: "patch",
            url: `/users/${loginUser?.id}`,
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

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1" textAlign="center">
          Eメール更新
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(handleOnSubmit)}>
          <ModalBody>
            <Stack>
              <Text as="p" textAlign="end" fontSize="xs">
                ※emailの更新にはパスワードが必要です
              </Text>
              <InputForm
                title="password"
                name="password"
                type="password"
                handleChange={handleChange}
                message="現在のpasswordを入力してください"
              />
              <InputForm
                title="email"
                name="email"
                type="email"
                handleChange={handleChange}
                message="新しいemailを入力してください"
              />
            </Stack>
          </ModalBody>
          <ModalFooter>
            <PrimaryButton onClick={onClose} color="cyan" size="md">
              Close
            </PrimaryButton>
            <Box ml={2}>
              <FormButton type="submit" color="yellow" size="md">
                edit
              </FormButton>
            </Box>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default EditEmailModal;
