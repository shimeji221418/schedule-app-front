import { Button } from "@chakra-ui/react";
import React, { FC, ReactNode, memo } from "react";

type Props = {
  children: ReactNode;
  type: "submit";
  color: string;
  fontColor?: string;
  size: string;
  onClose?: () => void;
};

const FormButton: FC<Props> = memo((props) => {
  const { type, children, color, fontColor = "white", size, onClose } = props;
  return (
    <>
      <Button
        type={type}
        colorScheme={color}
        size={size}
        color={fontColor}
        onClick={onClose}
      >
        {children}
      </Button>
    </>
  );
});

export default FormButton;
