import { IconButton } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import React, { FC, memo } from "react";

type Props = {
  onOpen: () => void;
};

const MenuIconButton: FC<Props> = memo((props) => {
  const { onOpen } = props;
  return (
    <IconButton
      aria-label="iconButton"
      icon={<HamburgerIcon />}
      variant="solid"
      bg="white"
      opacity=".8"
      color="teal"
      size={{ base: "sm", md: "md" }}
      _hover={{ textDecoration: "none" }}
      onClick={onOpen}
    />
  );
});

export default MenuIconButton;
