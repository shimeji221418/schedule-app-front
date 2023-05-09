import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import { GetUserType } from "@/types/api/user";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  Spacer,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfWeek,
  subDays,
} from "date-fns";
import { ja } from "date-fns/locale";
import React, { Dispatch, FC, SetStateAction, useCallback } from "react";
import PrimaryButton from "../atoms/PrimaryButton";
import ScheduleKinds from "../molecules/ScheduleKinds";
import EditScheduleModal from "../organisms/modal/EditScheduleModal";
import NewScheduleModal from "../organisms/modal/NewScheduleModal";

type Props = {
  mode: "team" | "custom";
  targetTeam: TeamType;
  weeklySchedules: Array<scheduleType>;
  dailySchedules: Array<scheduleType>;
  today: Date;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  selectUsers: Array<GetUserType>;
  tasks: Array<GetTaskType>;
  setWeeklySchedules: Dispatch<SetStateAction<scheduleType[]>>;
  setDailySchedules: Dispatch<SetStateAction<scheduleType[]>>;
};

const WeeklySchedule: FC<Props> = (props) => {
  const {
    mode,
    targetTeam,
    weeklySchedules,
    dailySchedules,
    today,
    date,
    setDate,
    selectUsers,
    tasks,
    setWeeklySchedules,
    setDailySchedules,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const nextWeek = useCallback(() => {
    setDate(addDays(date, 7));
  }, [targetTeam, date]);

  const prevWeek = useCallback(() => {
    setDate(subDays(date, 7));
  }, [targetTeam, date]);

  const thisWeek = useCallback(() => {
    setDate(today);
  }, [targetTeam, date]);

  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });

  const { targetDate, targetUser, openSchedule } = useOpenSchedule({ onOpen });
  const { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule } =
    useOpenEditSchedule();
  return (
    <Box maxW="1034px" m="auto">
      <Flex justify="space-between">
        <Box display="flex">
          <PrimaryButton size="md" color="linkedin" onClick={prevWeek}>
            <ArrowLeftIcon mr={1} />
            先週
          </PrimaryButton>
          <Box mx={2} mt={1}>
            <PrimaryButton size="sm" color="linkedin" onClick={thisWeek}>
              今週
            </PrimaryButton>
          </Box>
          <PrimaryButton size="md" color="linkedin" onClick={nextWeek}>
            来週
            <ArrowRightIcon ml={1} />
          </PrimaryButton>
        </Box>

        <Box mb={2}>
          <ScheduleKinds tasks={tasks} />
        </Box>
      </Flex>
      <Box display={"flex"} justifyContent="center">
        {selectUsers.length == 0 && mode == "custom" && (
          <Text fontSize={"lg"}>Userを選択してください</Text>
        )}
      </Box>
      {selectUsers.map((user) => (
        <Flex mb={4} key={user.id}>
          <Center border="1px solid" shadow="md" bg="white" mt={1}>
            <Box
              display="grid"
              placeItems="center"
              textAlign="center"
              mr="-1px"
              width={{ base: "100px", md: "130px" }}
              fontSize="lg"
            >
              {user.name}
            </Box>

            <Flex>
              {dates.map((day, i) => (
                <Box
                  key={i}
                  border="1px solid"
                  mr="-1px"
                  my="-1px"
                  width={{ base: "100px", md: "130px" }}
                >
                  <Tooltip
                    bg="gray.500"
                    fontWeight="bold"
                    label="新規予定は日付をクリック"
                  >
                    <Box
                      h="55px"
                      textAlign="center"
                      borderTop="solid 1px"
                      mt="-1px"
                      borderBottom="dashed 1px"
                      onClick={() => openSchedule(day, user)}
                      cursor="pointer"
                    >
                      <Box textAlign="center">
                        {format(day, "E", { locale: ja })}
                      </Box>
                      {format(day, "M/d")}
                    </Box>
                  </Tooltip>

                  {weeklySchedules.map(
                    (schedule) =>
                      format(day, "yyyy-MM-dd") ===
                        format(new Date(schedule.startAt), "yyyy-MM-dd") &&
                      user.id === schedule.userId && (
                        <Box
                          key={schedule.id}
                          h="55px"
                          borderBottom="1px solid"
                          mb="-1px"
                          cursor="pointer"
                          onClick={() => {
                            openEditSchedule(schedule);
                          }}
                          bg={schedule.scheduleKind?.color}
                        >
                          <Flex justify="center" align="center">
                            <Text
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                            >
                              {format(new Date(schedule.startAt), "k:mm")} -
                              {format(new Date(schedule.endAt), "k:mm")}
                            </Text>
                            <Box ml={1} mt={-1}>
                              {schedule.isLocked && (
                                <LockIcon color="gray.500" />
                              )}
                            </Box>
                          </Flex>
                          <Text
                            textAlign="center"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            px={1}
                            fontSize="lg"
                          >
                            {schedule.description}
                          </Text>
                        </Box>
                      )
                  )}
                </Box>
              ))}
            </Flex>
          </Center>
        </Flex>
      ))}

      <NewScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        date={targetDate}
        tasks={tasks}
        targetUser={targetUser}
        teamUser={selectUsers}
        weeklySchedules={weeklySchedules}
        dailySchedules={dailySchedules}
        setWeeklySchedules={setWeeklySchedules}
        setDailySchedules={setDailySchedules}
      />
      <EditScheduleModal
        isOpen={isModalOpen}
        onClose={closeEditSchedule}
        schedule={targetSchedule}
        tasks={tasks}
        teamUser={selectUsers}
        weeklySchedules={weeklySchedules}
        dailySchedules={dailySchedules}
        setWeeklySchedules={setWeeklySchedules}
        setDailySchedules={setDailySchedules}
      />
    </Box>
  );
};

export default WeeklySchedule;
