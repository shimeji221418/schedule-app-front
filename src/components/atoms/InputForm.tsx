import { Input, InputGroup, InputLeftAddon, Text } from "./index";
import React, { ChangeEvent, FC, memo, useEffect } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Props = {
  name: string;
  title: string;
  type: string;
  value?: string;
  fontSize?: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  message: string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
  width?: string;
};

const InputForm: FC<Props> = memo((props) => {
  const {
    name,
    title,
    type,
    value,
    fontSize = "md",
    handleChange,
    message,
    isReadOnly,
    width,
    isDisabled,
  } = props;
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  useEffect(() => {
    setValue(`${name}`, value ? `${value}` : "");
  }, []);

  return (
    <>
      <InputGroup>
        <InputLeftAddon
          children={title}
          bg="cyan.400"
          fontWeight="bold"
          color="white"
          w="100px"
          justifyContent="center"
        />
        <Input
          value={value}
          {...register(`${name}`, {
            required: `${message}`,
            onChange: (e) => handleChange(e),
          })}
          id={name}
          name={name}
          placeholder={title}
          type={type}
          isReadOnly={isReadOnly}
          disabled={isDisabled}
          width={width}
          fontSize={fontSize}
        />
      </InputGroup>
      {errors[name] && (
        <Text>{`${
          (errors[name] as DeepMap<FieldValues, FieldError>).message
        }`}</Text>
      )}
    </>
  );
});

export default InputForm;
