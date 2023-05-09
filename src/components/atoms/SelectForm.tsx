import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import { GetUserType } from "@/types/api/user";
import { InputGroup, InputLeftAddon, Select, Text } from "@chakra-ui/react";
import React, { ChangeEvent, FC, memo, useEffect, useState } from "react";
import {
  DeepMap,
  FieldError,
  FieldValues,
  useFormContext,
} from "react-hook-form";

type Props = {
  teams?: TeamType[];
  roles?: string[];
  tasks?: GetTaskType[];
  teamUsers?: GetUserType[];
  title: string;
  name: string;
  handleonChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  message: string;
  value?: number | string;
  isDisabled?: boolean;
  isReadOnly?: boolean;
};

const SelectForm: FC<Props> = memo((props) => {
  const {
    teams,
    title,
    name,
    handleonChange,
    message,
    roles,
    tasks,
    value,
    teamUsers,
    isDisabled,
  } = props;
  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext();

  useEffect(() => {
    setValue(`${name}`, value);
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
        <Select
          value={value}
          {...register(`${name}`, {
            required: `${message}`,
            onChange: (e) => handleonChange(e),
          })}
          name={name}
          disabled={isDisabled}
        >
          {teams && (
            <>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </>
          )}
          {roles && (
            <>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </>
          )}
          {tasks && (
            <>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.name}
                </option>
              ))}
            </>
          )}
          {teamUsers && (
            <>
              <option hidden value={"DEFAULT"}>
                選択してください
              </option>
              {teamUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </>
          )}
        </Select>
      </InputGroup>

      {errors[name] && (
        <Text>{`${
          (errors[name] as DeepMap<FieldValues, FieldError>).message
        }`}</Text>
      )}
    </>
  );
});

export default SelectForm;
