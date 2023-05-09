import PrimaryButton from "@/components/atoms/PrimaryButton";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  message: string;
};

const ErrorMessageModal: FC<Props> = (props) => {
  const { isOpen, onClose, message } = props;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader as="h1" textAlign="center" color="red">
          Caution!
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody textAlign="center" fontWeight="bold">
          {message}
        </ModalBody>
        <ModalFooter>
          <PrimaryButton onClick={onClose} color="cyan" size="md">
            Close
          </PrimaryButton>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ErrorMessageModal;
