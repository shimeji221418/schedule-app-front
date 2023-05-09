import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { Box, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { addDays, differenceInMinutes, startOfDay, subDays } from "date-fns";

import React, { Dispatch, FC, memo, SetStateAction, useCallback } from "react";
import { times } from "../atoms";
import PrimaryButton from "../atoms/PrimaryButton";
import EditScheduleModal from "../organisms/modal/EditScheduleModal";
import NewScheduleModal from "../organisms/modal/NewScheduleModal";
import { TeamType } from "@/types/api/team";
import { scheduleType } from "@/types/api/schedule";
import { GetUserType } from "@/types/api/user";
import { GetTaskType } from "@/types/api/schedule_kind";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from "@chakra-ui/icons";
import ScheduleKinds from "../molecules/ScheduleKinds";

type Props = {
  mode: "team" | "custom";
  userIds: Array<number>;
  targetTeam: TeamType;
  dailySchedules: Array<scheduleType>;
  weeklySchedules: Array<scheduleType>;
  today: Date;
  date: Date;
  setDate: Dispatch<SetStateAction<Date>>;
  selectUsers: Array<GetUserType>;
  tasks: Array<GetTaskType>;
  setWeeklySchedules: Dispatch<SetStateAction<scheduleType[]>>;
  setDailySchedules: Dispatch<SetStateAction<scheduleType[]>>;
};

const DailySchedule: FC<Props> = memo((props) => {
  const {
    mode,
    userIds,
    targetTeam,
    dailySchedules,
    today,
    date,
    setDate,
    selectUsers,
    tasks,
    setDailySchedules,
  } = props;
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { targetDate, targetUser, openSchedule } = useOpenSchedule({ onOpen });
  const { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule } =
    useOpenEditSchedule();

  const nextDay = useCallback(() => {
    setDate(addDays(date, 1));
  }, [targetTeam, date]);

  const prevDay = useCallback(() => {
    setDate(subDays(date, 1));
  }, [targetTeam, date]);

  const toToday = useCallback(() => {
    setDate(today);
  }, [targetTeam, date]);

  return (
    <>
      <Flex justify="space-between" mx="100px">
        <Box display="flex">
          <PrimaryButton size="md" color="linkedin" onClick={prevDay}>
            <ArrowLeftIcon mr={1} />
            昨日
          </PrimaryButton>
          <Box mx={2} mt={1}>
            <PrimaryButton size="sm" color="linkedin" onClick={toToday}>
              今日
            </PrimaryButton>
          </Box>

          <PrimaryButton size="md" color="linkedin" onClick={nextDay}>
            翌日
            <ArrowRightIcon ml={1} />
          </PrimaryButton>
        </Box>

        <Box>
          <ScheduleKinds tasks={tasks} />
        </Box>
      </Flex>

      <Flex justifyContent="center" marginTop="10px">
        {(userIds.length !== 0 || mode == "team") && (
          <Box marginTop="91px" padding={0} marginRight="30px">
            {times.map((hour, i) => (
              <Box key={i} marginBottom="52px" fontSize="lg">
                {hour}
              </Box>
            ))}
          </Box>
        )}

        <Flex>
          {selectUsers.length == 0 && mode == "custom" && (
            <Text fontSize={"lg"}>Userを選択してください</Text>
          )}
          {selectUsers.map((user) => (
            <Box w="120px" key={user.id} position="relative" mr="40px">
              <Box
                onClick={() => openSchedule(date, user)}
                cursor="pointer"
                fontSize="lg"
                fontWeight="bold"
              >
                {user.name}
              </Box>
              <Box zIndex="0" position="absolute" bg="white" shadow="md">
                {[...Array(11)].map((_, i) => (
                  <Box
                    as="div"
                    height="80px"
                    width="120px"
                    borderBottom="1px dashed"
                    boxSizing="border-box"
                    borderLeft="1px solid"
                    borderRight="1px solid"
                    key={i}
                    cursor="pointer"
                    _first={{ borderTop: "1px solid" }}
                    onClick={() => openSchedule(date, user)}
                  ></Box>
                ))}
              </Box>
              {dailySchedules.map(
                (schedule) =>
                  user.id === schedule.userId && (
                    <Box
                      key={schedule.id}
                      backgroundColor={schedule.scheduleKind?.color}
                      position="absolute"
                      width="118px"
                      ml="1px"
                      zIndex="1"
                      marginTop={`${
                        ((differenceInMinutes(
                          new Date(schedule.startAt),
                          startOfDay(new Date(schedule.startAt))
                        ) -
                          480) *
                          80) /
                          60 +
                        80
                      }px`}
                      height={`${
                        (differenceInMinutes(
                          new Date(schedule.endAt),
                          new Date(schedule.startAt)
                        ) *
                          80) /
                          60 -
                        1
                      }px`}
                      onClick={() => {
                        openEditSchedule(schedule);
                      }}
                    >
                      <Box textAlign="end" px={1}>
                        {schedule.isLocked && <LockIcon color="gray.500" />}
                      </Box>
                      <Text
                        as="h1"
                        fontSize="lg"
                        textAlign="center"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                        px={1}
                      >
                        {schedule.description}
                      </Text>
                    </Box>
                  )
              )}
            </Box>
          ))}
        </Flex>
      </Flex>
      <NewScheduleModal
        isOpen={isOpen}
        onClose={onClose}
        date={targetDate}
        tasks={tasks}
        targetUser={targetUser}
        teamUser={selectUsers}
        dailySchedules={dailySchedules}
        setDailySchedules={setDailySchedules}
      />
      <EditScheduleModal
        isOpen={isModalOpen}
        onClose={closeEditSchedule}
        schedule={targetSchedule}
        tasks={tasks}
        teamUser={selectUsers}
        dailySchedules={dailySchedules}
        setDailySchedules={setDailySchedules}
      />
    </>
  );
});

export default DailySchedule;
