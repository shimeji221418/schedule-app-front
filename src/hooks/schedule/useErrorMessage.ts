import { useCallback, useState } from "react";

export const useErrorMessage = () => {
  const [isErrorMessage, setIsErrorMessage] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const errorModalOpen = useCallback(
    (message: string) => {
      setIsErrorMessage(true);
      setMessage(message);
    },
    [isErrorMessage, setIsErrorMessage]
  );

  const errorModalClose = useCallback(() => {
    setIsErrorMessage(false);
    setMessage("");
  }, [isErrorMessage, setIsErrorMessage]);

  return {
    isErrorMessage,
    message,
    errorModalOpen,
    errorModalClose,
  };
};
