import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { GetTaskType } from "@/types/api/schedule_kind";
import { Auth } from "firebase/auth";
import { useState } from "react";
import { LoginUserType } from "../types/api/user";

type Props = {
  auth: Auth;
  loginUser: LoginUserType;
};

export const useGetTasks = (props: Props) => {
  const { auth, loginUser } = props;
  const [tasks, setTasks] = useState<Array<GetTaskType>>([]);
  const getTask = async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      if (loginUser) {
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: `/schedule_kinds`,
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        setTasks(res.data);
      }
    } catch (e: any) {
      console.log(e);
    }
  };
  return { tasks, getTask };
};
