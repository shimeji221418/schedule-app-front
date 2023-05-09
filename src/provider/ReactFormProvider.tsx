"use client";
import React, { FC, ReactNode } from "react";
import { FormProvider, useForm } from "react-hook-form";

type Props = {
  children: ReactNode;
};

const ReactFormProvider: FC<Props> = ({ children }) => {
  const methods = useForm();
  return (
    <>
      <FormProvider {...methods}>{children}</FormProvider>
    </>
  );
};

export default ReactFormProvider;
