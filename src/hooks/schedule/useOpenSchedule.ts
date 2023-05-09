import { GetUserType } from "@/types/api/user";
import { format } from "date-fns";
import { useCallback, useState } from "react";

type Props = {
  onOpen: () => void;
};

export const useOpenSchedule = (props: Props) => {
  const { onOpen } = props;
  const [targetDate, setTargetDate] = useState<string>("");
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });

  const openSchedule = useCallback(
    (day: Date, user: GetUserType) => {
      setTargetDate(format(day, "yyyy-MM-dd"));
      setTargetUser(user);
      onOpen();
    },
    [targetUser, targetDate]
  );

  return { targetDate, targetUser, openSchedule };
};
