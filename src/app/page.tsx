"use client";
import { getAuth } from "firebase/auth";
import { app } from "../../firebase";
import { useAuthContext } from "@/provider/AuthProvider";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { format } from "date-fns";
import {
  Box,
  Button,
  Checkbox,
  InputGroup,
  Menu,
  MenuButton,
  MenuList,
  MenuOptionGroup,
  Radio,
  RadioGroup,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

import { TeamType } from "@/types/api/team";

import { useGetTeams } from "@/hooks/useGetTeams";
import SelectForm from "@/components/atoms/SelectForm";
import { useGetSchedules } from "@/hooks/useGetSchedules";

import InputForm from "@/components/atoms/InputForm";
import { useGetTasks } from "@/hooks/useGetTasks";
import DailySchedule from "@/components/templates/DailySchedule";
import WeeklySchedule from "@/components/templates/WeeklySchedule";
import { useGetAllUsers } from "@/hooks/useAllUsers";
import { ChevronDownIcon } from "@chakra-ui/icons";

export type TargetUserType = {
  id: number;
  name: string;
};

export default function Home() {
  const auth = getAuth(app);
  const today: Date = new Date();
  const [isDailyCalendar, setIsDailyCalendar] = useState(false);

  const { loginUser } = useAuthContext();
  const { teams, getTeamsWithoutAuth } = useGetTeams();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 0,
    name: "",
  });
  const [mode, setMode] = useState<"team" | "custom">("team");
  const {
    weeklySchedules,
    dailySchedules,
    setWeeklySchedules,
    setDailySchedules,
    date,
    setDate,
    userIds,
    onClickUser,
  } = useGetSchedules(targetTeam.id, mode);
  const { tasks, getTask } = useGetTasks({ auth, loginUser });
  const { allUsers, getAllUsers } = useGetAllUsers({ auth });
  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setTargetTeam({ ...targetTeam, [name]: value });
      console.log(targetTeam.id);
    },
    [targetTeam]
  );

  const ChangeDaily = async () => {
    setIsDailyCalendar(true);
  };

  const ChangeWeekly = () => {
    setIsDailyCalendar(false);
  };

  const selectUsers =
    mode === "team"
      ? allUsers.filter((user) => user.teamId == targetTeam.id)
      : allUsers.filter((user) => userIds.includes(user.id));

  useEffect(() => {
    if (loginUser) {
      getTask();
      getTeamsWithoutAuth();
      getAllUsers();
      setTargetTeam({ ...targetTeam, id: loginUser.teamId });
    }
  }, []);

  return (
    <>
      {loginUser && (
        <>
          <Stack
            w="300px"
            align="center"
            mt={2}
            ml={2}
            border="1px solid"
            borderColor="gray.400"
            borderRadius="md"
            p={2}
          >
            <RadioGroup
              onChange={(value: "team" | "custom") => setMode(value)}
              value={mode}
              colorScheme="cyan"
            >
              <Stack spacing={5} direction="row">
                <Radio value="team">
                  <Text fontSize="lg">チーム選択</Text>
                </Radio>
                <Radio value="custom">
                  <Text fontSize="lg">ユーザー選択</Text>
                </Radio>
              </Stack>
            </RadioGroup>

            <Box h="40px" w="250px">
              {mode == "team" ? (
                <SelectForm
                  teams={teams}
                  title="team"
                  name="id"
                  value={targetTeam.id}
                  message="チームが選択されていません"
                  handleonChange={handleSelectChange}
                />
              ) : (
                <Box display="flex" alignItems="center">
                  <Menu>
                    <MenuButton
                      as={Button}
                      _hover={{ opacity: "none" }}
                      rightIcon={<ChevronDownIcon />}
                      bg="cyan.400"
                      color="white"
                      w="300px"
                    >
                      Users
                    </MenuButton>
                    <MenuList display="flex" alignItems="center">
                      <MenuOptionGroup>
                        <Stack spacing={3} p={2}>
                          {allUsers.map((user) => (
                            <Checkbox
                              colorScheme="cyan"
                              key={user.id}
                              onChange={() => onClickUser(user.id)}
                              isChecked={userIds.includes(user.id)}
                            >
                              {user.name}
                            </Checkbox>
                          ))}
                        </Stack>
                      </MenuOptionGroup>
                    </MenuList>
                  </Menu>
                </Box>
              )}
            </Box>
          </Stack>

          <Box w="xs" m="auto">
            <InputGroup>
              <InputForm
                type="date"
                name="date"
                title="日付"
                fontSize="xl"
                value={format(date, "yyyy-MM-dd")}
                handleChange={(e) => {
                  setDate(new Date(e.target.value));
                }}
                message="日付を入力してください"
              />
            </InputGroup>
          </Box>

          <Tabs
            size="lg"
            variant="enclosed"
            colorScheme="cyan"
            borderColor="gray.400"
          >
            <TabList>
              <Tab fontWeight="bold" onClick={ChangeWeekly}>
                Weekly
              </Tab>
              <Tab fontWeight="bold" onClick={ChangeDaily}>
                Daily
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <>
                  {!isDailyCalendar && (
                    <WeeklySchedule
                      setWeeklySchedules={setWeeklySchedules}
                      dailySchedules={dailySchedules}
                      setDailySchedules={setDailySchedules}
                      mode={mode}
                      targetTeam={targetTeam}
                      weeklySchedules={weeklySchedules}
                      today={today}
                      date={date}
                      setDate={setDate}
                      selectUsers={selectUsers}
                      tasks={tasks}
                    />
                  )}
                </>
              </TabPanel>
              <TabPanel>
                <>
                  {isDailyCalendar && dailySchedules && (
                    <DailySchedule
                      mode={mode}
                      userIds={userIds}
                      targetTeam={targetTeam}
                      dailySchedules={dailySchedules}
                      weeklySchedules={weeklySchedules}
                      today={today}
                      date={date}
                      setDate={setDate}
                      selectUsers={selectUsers}
                      tasks={tasks}
                      setWeeklySchedules={setWeeklySchedules}
                      setDailySchedules={setDailySchedules}
                    />
                  )}
                </>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </>
      )}
    </>
  );
}
