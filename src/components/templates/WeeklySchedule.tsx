import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import { TeamType } from "@/types/api/team";
import { GetUserType } from "@/types/api/user";
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
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
import {
  addDays,
  eachDayOfInterval,
  endOfWeek,
  format,
  getDate,
  isToday,
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
    <Box>
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
      <TableContainer>
        {selectUsers.map((user) => (
          <Flex mb={4} key={user.id} shadow="md" bg="white" mt={1}>
            <Table
              variant={"simple"}
              border={"1px solid"}
              borderColor={"gray.300"}
            >
              <Thead>
                <Tr>
                  <Th
                    textAlign={"center"}
                    w={"120px"}
                    border={"1px solid"}
                    borderColor={"gray.300"}
                  >
                    User
                  </Th>
                  {dates.map((date, i) => (
                    <Th
                      key={i}
                      maxW={"200px"}
                      textAlign={"center"}
                      borderBottom={"1px solid"}
                      borderColor={"gray.300"}
                      onClick={() => openSchedule(date, user)}
                      cursor={"pointer"}
                    >
                      <Text>{format(date, "E", { locale: ja })}</Text>
                      <Text
                        bg={isToday(date) ? "cyan.300" : ""}
                        borderRadius={"full"}
                      >
                        {getDate(date)}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Th
                    fontSize={"md"}
                    maxW={"200px"}
                    minW={"200px"}
                    textAlign={"center"}
                    whiteSpace="nowrap"
                    overflow="hidden"
                    textOverflow="ellipsis"
                  >
                    {user.name}
                  </Th>
                  {dates.map((date, i) => (
                    <Td
                      key={i}
                      maxW={"200px"}
                      w={"200px"}
                      border={"1px solid"}
                      borderColor={"gray.300"}
                      p={0}
                      onClick={() => openSchedule(date, user)}
                      cursor={"pointer"}
                    >
                      {weeklySchedules
                        .sort((a, b) => {
                          return (
                            new Date(a.startAt).getTime() -
                            new Date(b.startAt).getTime()
                          );
                        })
                        .map(
                          (schedule) =>
                            format(date, "yyyy-MM-dd") ===
                              format(
                                new Date(schedule.startAt),
                                "yyyy-MM-dd"
                              ) &&
                            user.id === schedule.userId && (
                              <Box
                                key={schedule.id}
                                m={1}
                                cursor="pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditSchedule(schedule);
                                }}
                                bg={schedule.scheduleKind?.color}
                                textAlign={"center"}
                              >
                                <Stack spacing={0.5}>
                                  <Text>
                                    {`${format(
                                      new Date(schedule.startAt),
                                      "k:mm"
                                    )} - ${format(
                                      new Date(schedule.endAt),
                                      "k:mm"
                                    )}`}
                                  </Text>
                                  <Box ml={1} mt={-1}>
                                    {schedule.isLocked && (
                                      <LockIcon color="gray.500" />
                                    )}
                                  </Box>
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
                                </Stack>
                              </Box>
                            )
                        )}
                    </Td>
                  ))}
                </Tr>
              </Tbody>
            </Table>
          </Flex>
        ))}
      </TableContainer>
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
