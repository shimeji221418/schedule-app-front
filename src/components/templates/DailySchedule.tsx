import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import {
  Box,
  Flex,
  HStack,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
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
      <Flex justify="space-between">
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

      {selectUsers.length == 0 && mode == "custom" && (
        <Text fontSize={"lg"}>Userを選択してください</Text>
      )}
      <TableContainer>
        <Flex mt={5}>
          <Box marginTop={"88px"} mx={1}>
            {(userIds.length !== 0 || mode == "team") && (
              <Stack spacing={"33px"} marginRight="20px">
                {times.map((hour, i) => (
                  <Box key={i} fontSize="lg">
                    {hour}
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
          <Table variant={"simple"} h={"80vh"}>
            <Thead>
              <Tr>
                {selectUsers.map((user) => (
                  <Th
                    onClick={() => openSchedule(date, user)}
                    cursor="pointer"
                    fontSize="lg"
                    w={`${100 / selectUsers.length}%`}
                  >
                    {user.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                {selectUsers.map((user) => (
                  <Td
                    key={user.id}
                    p={0}
                    position={"relative"}
                    w={`${100 / selectUsers.length}%`}
                  >
                    {dailySchedules.map(
                      (schedule) =>
                        user.id === schedule.userId && (
                          <Td
                            key={schedule.id}
                            backgroundColor={schedule.scheduleKind?.color}
                            position="absolute"
                            zIndex="1"
                            mt={`${
                              differenceInMinutes(
                                new Date(schedule.startAt),
                                startOfDay(new Date(schedule.startAt))
                              ) +
                              0.5 -
                              480
                            }px`}
                            h={`${
                              (differenceInMinutes(
                                new Date(schedule.endAt),
                                new Date(schedule.startAt)
                              ) *
                                60) /
                              60
                            }px`}
                            w={"100%"}
                            onClick={() => {
                              openEditSchedule(schedule);
                            }}
                            cursor={"pointer"}
                            mr={-3}
                          >
                            <Box textAlign="end" px={1}>
                              {schedule.isLocked && (
                                <LockIcon color="gray.500" />
                              )}
                            </Box>
                            <Text
                              display="flex"
                              fontSize={
                                (differenceInMinutes(
                                  new Date(schedule.endAt),
                                  new Date(schedule.startAt)
                                ) *
                                  60) /
                                  60 <=
                                45
                                  ? "2xs"
                                  : "lg"
                              }
                              textAlign="center"
                              alignItems="center"
                              justifyContent="center"
                              whiteSpace="nowrap"
                              overflow="hidden"
                              textOverflow="ellipsis"
                              px={1}
                              h="100%"
                              py={0}
                            >
                              {schedule.description}
                            </Text>
                          </Td>
                        )
                    )}
                    {[...Array(10)].map((_, i) => (
                      <Stack key={i}>
                        <Td
                          color={"gray.300"}
                          border={"0.5px solid"}
                          h={"60px"}
                          zIndex={0}
                          onClick={() => openSchedule(date, user)}
                          cursor={"pointer"}
                        ></Td>
                      </Stack>
                    ))}
                  </Td>
                ))}
              </Tr>
            </Tbody>
          </Table>
        </Flex>
      </TableContainer>

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
