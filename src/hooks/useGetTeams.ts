import { TeamType } from "@/types/api/team";
import { useCallback, useState } from "react";
import {
  BaseClientWithoutAuthType,
  BaseClientWithoutAuth,
} from "../lib/api/client";

export const useGetTeams = () => {
  const [teams, setTeams] = useState<Array<TeamType>>([]);
  const getTeamsWithoutAuth = useCallback(async () => {
    try {
      const params: BaseClientWithoutAuthType = {
        method: "get",
        url: "/teams",
      };
      const res = await BaseClientWithoutAuth(params);
      setTeams(res.data);
    } catch (e: any) {
      console.log(e);
    }
  }, [teams]);

  return { teams, getTeamsWithoutAuth };
};
