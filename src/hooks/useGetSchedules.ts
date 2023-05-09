import { scheduleType } from "@/types/api/schedule";
import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { format, startOfWeek } from "date-fns";

type Props = {
  team_id: number;
  date: string;
};

export const useGetSchedules = (id?: number, mode?: "team" | "custom") => {
  const auth = getAuth(app);
  const [date, setDate] = useState<Date>(new Date());

  const { loginUser } = useAuthContext();
  const [weeklySchedules, setWeeklySchedules] = useState<Array<scheduleType>>(
    []
  );
  const [dailySchedules, setDailySchedules] = useState<Array<scheduleType>>([]);
  const [userIds, setUserIds] = useState<Array<number>>([]);

  const onClickUser = (id: number) => {
    let newUserIds: Array<number> = [];
    if (userIds.includes(id)) {
      newUserIds = userIds.filter((userId) => userId !== id);
    } else {
      newUserIds = [...userIds, id];
    }
    setUserIds(newUserIds);
  };

  const getSchedules = useCallback(
    async (props: Props) => {
      const { team_id, date } = props;
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { team_id: team_id, date: date };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/weekly_team_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        const api: Array<scheduleType> = res.data;
        const sortData = api.sort(
          (a, b) =>
            Number(format(new Date(a.startAt), "k")) -
            Number(format(new Date(b.startAt), "k"))
        );
        setWeeklySchedules(sortData);
        console.log(res.data);
      } catch (e: any) {
        console.log(e);
      }
    },
    [weeklySchedules]
  );

  const getDailySchedules = useCallback(
    async (props: Props) => {
      const { team_id, date } = props;
      try {
        if (loginUser) {
          const token = await auth.currentUser?.getIdToken(true);
          const data = {
            team_id: team_id,
            date: date,
          };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/schedules/daily_team_schedules",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          console.log(res.data);
          setDailySchedules(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    },
    [dailySchedules]
  );

  const getCustomSchedules = useCallback(
    async (startDate: string) => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_ids: userIds.join(","), date: startDate };
        const props: BaseClientWithAuthType = {
          method: "get",
          url: "/schedules/weekly_custom_schedules",
          token: token!,
          params: data,
        };
        const res = await BaseClientWithAuth(props);
        const api: Array<scheduleType> = res.data;
        const sortData = api.sort(
          (a, b) =>
            Number(format(new Date(a.startAt), "k")) -
            Number(format(new Date(b.startAt), "k"))
        );
        setWeeklySchedules(sortData);
        console.log(res.data);
      } catch (e: any) {
        console.log(e);
      }
    },
    [userIds]
  );

  const getCustomDailySchedules = useCallback(async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const data = { user_ids: userIds.join(","), date: date };
      const props: BaseClientWithAuthType = {
        method: "get",
        url: "/schedules/daily_custom_schedules",
        token: token!,
        params: data,
      };
      const res = await BaseClientWithAuth(props);
      setDailySchedules(res.data);
      console.log(res.data);
    } catch (e: any) {
      console.log(e);
    }
  }, [userIds, date]);

  useEffect(() => {
    if (loginUser && date && id && mode == "team") {
      const day = format(date, "yyyy-MM-dd");
      const startDate = format(startOfWeek(date), "yyyy-MM-dd");

      getSchedules({ team_id: id, date: startDate });
      getDailySchedules({ team_id: id, date: day });
    }
  }, [loginUser, date, id, mode]);

  useEffect(() => {
    if (userIds.length >= 1 && mode == "custom") {
      const startDate = format(startOfWeek(date), "yyyy-MM-dd");
      getCustomSchedules(startDate);
      getCustomDailySchedules();
    }
  }, [userIds, date, mode]);

  return {
    getSchedules,
    weeklySchedules,
    setWeeklySchedules,
    dailySchedules,
    setDailySchedules,
    date,
    setDate,
    userIds,
    onClickUser,
  };
};
