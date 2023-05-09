"use client";
import { app } from "../../../firebase";
import { getAuth } from "firebase/auth";
import React, { useCallback, useEffect, useState } from "react";
import {
  addDays,
  differenceInMinutes,
  eachDayOfInterval,
  endOfWeek,
  format,
  startOfDay,
  startOfWeek,
  subDays,
} from "date-fns";
import {
  Box,
  Flex,
  InputGroup,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import ja from "date-fns/locale/ja";
import { useAuthContext } from "@/provider/AuthProvider";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { times } from "@/components/atoms";
import { scheduleType } from "@/types/api/schedule";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import InputForm from "@/components/atoms/InputForm";
import NewScheduleModal from "@/components/organisms/modal/NewScheduleModal";
import EditScheduleModal from "@/components/organisms/modal/EditScheduleModal";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";
import ScheduleKinds from "@/components/molecules/ScheduleKinds";
import { useGetTasks } from "@/hooks/useGetTasks";
import { useOpenSchedule } from "@/hooks/schedule/useOpenSchedule";
import { useOpenEditSchedule } from "@/hooks/schedule/useOpenEditSchedule";
import { useGetSchedules } from "@/hooks/useGetSchedules";
import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";

const MySchedule = () => {
  const auth = getAuth(app);
  const today: Date = new Date();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { loginUser } = useAuthContext();
  const { targetDate, targetUser, openSchedule } = useOpenSchedule({ onOpen });
  const { getTeamUsers, teamUser } = useGetTeamUsers(targetUser.teamId);
  const { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule } =
    useOpenEditSchedule();
  const { tasks, getTask } = useGetTasks({ auth, loginUser });
  const [date, setDate] = useState<Date>(today);
  const [mySchedules, setMySchedules] = useState<Array<scheduleType>>([]);
  const dates = eachDayOfInterval({
    start: startOfWeek(date),
    end: endOfWeek(date),
  });
  const { setWeeklySchedules } = useGetSchedules();

  const nextWeek = useCallback(async () => {
    setDate(addDays(date, 7));
  }, [mySchedules, date]);

  const prevWeek = useCallback(async () => {
    setDate(subDays(date, 7));
  }, [mySchedules, date]);

  useEffect(() => {
    const getMySchedule = async () => {
      try {
        if (loginUser) {
          const startDate = format(startOfWeek(date), "yyyy-MM-dd");
          const token = await auth.currentUser?.getIdToken(true);
          const data = { user_id: loginUser.id, date: startDate };
          const props: BaseClientWithAuthType = {
            method: "get",
            url: "/schedules/my_schedules",
            token: token!,
            params: data,
          };
          const res = await BaseClientWithAuth(props);
          setMySchedules(res.data);
          console.log(res.data);
        }
      } catch (e: any) {
        console.log(e);
      }
    };
    getTask();
    getMySchedule();
    if (loginUser) {
      getTeamUsers({ team_id: loginUser?.teamId });
    }
  }, [loginUser, date]);

  return (
    <>
      {loginUser && (
        <Box maxW="900px" m="auto" mt={2}>
          <ScheduleKinds tasks={tasks} />
          <Flex
            pt={4}
            m="auto"
            textAlign="center"
            justify="space-between"
            w="900px"
          >
            <Flex ml={"50px"}>
              <Box mr={2}>
                <PrimaryButton size="md" color="cyan" onClick={prevWeek}>
                  <ArrowLeftIcon mr={1} />
                  先週
                </PrimaryButton>
              </Box>

              <PrimaryButton size="md" color="cyan" onClick={nextWeek}>
                来週
                <ArrowRightIcon ml={1} />
              </PrimaryButton>
            </Flex>
            <InputGroup width="300px">
              <InputForm
                type="date"
                name="date"
                title="date"
                value={format(date, "yyyy-MM-dd")}
                handleChange={(e) => {
                  setDate(new Date(e.target.value));
                }}
                message="日付を入力してください"
              />
            </InputGroup>
          </Flex>
          <Box textAlign="center" fontSize="2xl" mb={4} mt={2}>
            {loginUser?.name}
          </Box>

          <Flex justifyContent="center" position="relative" width="100%">
            <Box marginTop="114px">
              {times.map((time, i) => (
                <Box key={i} marginBottom="56px" marginRight="20px">
                  {time}
                </Box>
              ))}
            </Box>
            <Flex justifyContent="center" textAlign="center">
              {dates.map((day, i) => (
                <Box key={i} textAlign="center" width="100px">
                  <Box>{format(day, "E", { locale: ja })}</Box>
                  <Box>{format(day, "MM/dd")}</Box>
                  <Tooltip
                    bg="gray.500"
                    fontWeight="bold"
                    label="新規予定は空マスをクリック"
                    placement="right"
                  >
                    <Box position="absolute">
                      {[...Array(11)].map((_, i) => (
                        <Box
                          as="div"
                          height="80px"
                          width="100px"
                          borderRight="1px solid"
                          borderBottom="1px dashed"
                          boxSizing="border-box"
                          key={i}
                          backgroundColor="white"
                          zIndex="-1"
                          cursor="pointer"
                          onClick={() => {
                            openSchedule(day, loginUser);
                          }}
                        ></Box>
                      ))}
                    </Box>
                  </Tooltip>

                  <Box>
                    {mySchedules.map(
                      (schedule) =>
                        format(day, "yyyy-MM-dd") ===
                          format(new Date(schedule.startAt), "yyyy-MM-dd") && (
                          <Box
                            onClick={() => {
                              openEditSchedule(schedule);
                            }}
                            cursor="pointer"
                            key={schedule.id}
                            position="absolute"
                            backgroundColor={schedule.scheduleKind?.color}
                            width="99px"
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
                            boxShadow="md"
                            whiteSpace="nowrap"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            px={1}
                          >
                            {schedule.description}
                          </Box>
                        )
                    )}
                  </Box>
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
            weeklySchedules={mySchedules}
            setWeeklySchedules={setWeeklySchedules}
            mySchedules={mySchedules}
            setMySchedules={setMySchedules}
          />
          <EditScheduleModal
            isOpen={isModalOpen}
            onClose={closeEditSchedule}
            tasks={tasks}
            schedule={targetSchedule}
            teamUser={teamUser}
            weeklySchedules={mySchedules}
            setWeeklySchedules={setWeeklySchedules}
          />
        </Box>
      )}
    </>
  );
};

export default MySchedule;
