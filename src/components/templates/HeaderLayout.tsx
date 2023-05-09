import React, { FC, ReactNode } from "react";
import Header from "../organisms/Header";

type Props = {
  children: ReactNode;
};

const HeaderLayout: FC<Props> = (props) => {
  const { children } = props;
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default HeaderLayout;
