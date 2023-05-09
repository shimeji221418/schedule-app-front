import FormButton from "@/components/atoms/FormButton";
import InputForm from "@/components/atoms/InputForm";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { useMessage } from "@/hooks/useMessage";
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
} from "@chakra-ui/react";
import {
  Auth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import React, { ChangeEvent, FC, useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";

type Props = {
  isModalOpen: boolean;
  onClose: () => void;
  loginUser: LoginUserType;
  auth: Auth;
};

type Password = {
  currentPassword: string;
  newPassword: string;
};

const EditPasswordModal: FC<Props> = (props) => {
  const { isModalOpen, onClose, auth } = props;
  const [password, setPassword] = useState<Password>({
    currentPassword: "",
    newPassword: "",
  });
  const { handleSubmit } = useFormContext();
  const { showMessage } = useMessage();

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setPassword({ ...password, [name]: value });
    },
    [password, setPassword]
  );

  const handlePasswordChange = async () => {
    try {
      if (auth.currentUser) {
        const credential = EmailAuthProvider.credential(
          auth.currentUser.email!,
          password.currentPassword
        );
        await reauthenticateWithCredential(auth.currentUser, credential);
        await updatePassword(auth.currentUser, password.newPassword);
        console.log(password);
        showMessage({ title: "更新しました", status: "success" });
      }
    } catch (e: any) {
      console.log(e);
      showMessage({ title: `${e.message}`, status: "error" });
    } finally {
      onClose();
      location.reload();
    }
  };

  return (
    <Modal isOpen={isModalOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1" textAlign="center">
          パスワード更新
        </ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(handlePasswordChange)}>
          <ModalBody>
            <Stack>
              <InputForm
                title="current"
                name="currentPassword"
                type="password"
                handleChange={handleChange}
                message="現在のpasswordを入力してください"
              />
              <InputForm
                title="new"
                name="newPassword"
                type="password"
                handleChange={handleChange}
                message="新しいpasswordを入力してください"
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

export default EditPasswordModal;
