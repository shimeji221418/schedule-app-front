import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { useCallback, useEffect, useState } from "react";
import { GetUserType } from "@/types/api/user";

type Props = {
  team_id: number;
};

export const useGetTeamUsers = (teamId: number) => {
  const auth = getAuth(app);
  const { loginUser } = useAuthContext();
  const [teamUser, setTeamUser] = useState<Array<GetUserType>>([]);
  const getTeamUsers = useCallback(
    async (props: Props) => {
      const { team_id } = props;
      try {
        const token = await auth.currentUser?.getIdToken(true);
        if (loginUser) {
          const data = { team_id: team_id };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/users/team_users",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          setTeamUser(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    },
    [teamUser, loginUser]
  );

  const GetAllUsers = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const props: BaseClientWithAuthType = {
        method: "get",
        url: "/users",
        token: token!,
      };
      const res = await BaseClientWithAuth(props);
      console.log(res.data);
      setTeamUser(res.data);
    } catch (e: any) {
      console.log(e);
    }
  }, [teamUser]);

  useEffect(() => {
    if (loginUser && teamId != 0) {
      getTeamUsers({ team_id: teamId });
    }
    if (loginUser && teamId == 1) {
      GetAllUsers();
    }
  }, [loginUser, teamId]);
  return { getTeamUsers, teamUser, setTeamUser };
};
