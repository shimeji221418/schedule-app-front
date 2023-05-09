import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { GetUserType } from "@/types/api/user";
import { Auth } from "firebase/auth";
import { useCallback, useState } from "react";

type Props = {
  auth: Auth;
};

export const useGetAllUsers = (props: Props) => {
  const { auth } = props;

  const [allUsers, setAllUsers] = useState<Array<GetUserType>>([]);

  const getAllUsers = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const props: BaseClientWithAuthType = {
        method: "get",
        url: "/users",
        token: token!,
      };
      const res = await BaseClientWithAuth(props);
      console.log(res.data);
      setAllUsers(res.data);
    } catch (e: any) {
      console.log(e);
    }
  }, [allUsers, setAllUsers]);

  return { allUsers, getAllUsers };
};
