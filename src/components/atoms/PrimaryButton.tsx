import { Button } from "./index";
import React, { FC, memo, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick: () => void;
  size: string;
  color: string;
  fontColor?: string;
};

const PrimaryButton: FC<Props> = memo((props) => {
  const { children, onClick, size, color, fontColor = "white" } = props;
  return (
    <>
      <Button
        onClick={onClick}
        size={size}
        colorScheme={color}
        color={fontColor}
      >
        {children}
      </Button>
    </>
  );
});

export default PrimaryButton;
