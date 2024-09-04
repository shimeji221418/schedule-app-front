import { EndTimeType, StartTimeType } from "@/types";
import { EditScheduleType, scheduleType } from "@/types/api/schedule";
import { GetTaskType } from "@/types/api/schedule_kind";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  ModalFooter,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Textarea,
  Checkbox,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { app } from "../../../../firebase";
import { getAuth } from "firebase/auth";
import React, {
  ChangeEvent,
  Dispatch,
  FC,
  memo,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { hours, minutes } from "../../atoms";
import SelectForm from "../../atoms/SelectForm";
import { useFormContext } from "react-hook-form";
import FormButton from "../../atoms/FormButton";
import { GetUserType } from "@/types/api/user";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import DeleteModal from "./deleteModal";
import PrimaryButton from "../../atoms/PrimaryButton";
import { useAuthContext } from "@/provider/AuthProvider";
import { useErrorMessage } from "@/hooks/schedule/useErrorMessage";
import ErrorMessageModal from "./ErrorMessageModal";
import { useMessage } from "@/hooks/useMessage";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  schedule: scheduleType | null;
  tasks: Array<GetTaskType>;
  teamUser: Array<GetUserType>;
  weeklySchedules?: Array<scheduleType>;
  dailySchedules?: Array<scheduleType>;
  setWeeklySchedules?: Dispatch<SetStateAction<scheduleType[]>>;
  setDailySchedules?: Dispatch<SetStateAction<scheduleType[]>>;
};

const EditScheduleModal: FC<Props> = memo((props) => {
  const {
    isOpen,
    onClose,
    schedule,
    tasks,
    teamUser,
    setWeeklySchedules,
    setDailySchedules,
    weeklySchedules,
    dailySchedules,
  } = props;
  const { loading, loginUser } = useAuthContext();
  const { showMessage } = useMessage();
  const auth = getAuth(app);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const { handleSubmit, clearErrors } = useFormContext();
  const [editSchedule, setEditSchedule] = useState<EditScheduleType>({
    id: 0,
    start_at: "",
    end_at: "",
    is_Locked: false,
    description: "",
    user_id: 0,
    schedule_kind_id: 0,
  });
  const { isErrorMessage, message, errorModalOpen, errorModalClose } =
    useErrorMessage();

  const [startDay, setStartDay] = useState<string>("");

  const [startTime, setStartTime] = useState<StartTimeType>({
    startHour: "",
    startMinutes: "",
  });
  const [endTime, setEndTime] = useState<EndTimeType>({
    endHour: "",
    endMinutes: "",
  });

  const isDisabled = schedule?.isLocked && schedule?.userId !== loginUser?.id;

  const handleStartTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setStartTime({ ...startTime, [name]: value });
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setEndTime({ ...endTime, [name]: value });
  };
  useEffect(() => {
    setEditSchedule({
      ...editSchedule,
      end_at: `${startDay} ${endTime.endHour}:${endTime.endMinutes}`,
      start_at: `${startDay} ${startTime.startHour}:${startTime.startMinutes}`,
    });
  }, [startDay, endTime, startTime]);

  const handleonChange = (
    e: ChangeEvent<HTMLTextAreaElement> | ChangeEvent<HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.value;
    setEditSchedule({ ...editSchedule, [name]: value });
  };

  const OpenDeleteModal = useCallback(() => {
    setIsDeleteModal(true);
  }, []);

  const CloseDeleteModal = useCallback(() => {
    setIsDeleteModal(false);
  }, []);

  useEffect(() => {
    if (schedule) {
      const startDate = new Date(schedule.startAt.toString());
      const endDate = new Date(schedule.endAt.toString());
      setEditSchedule({
        ...editSchedule,
        id: schedule.id,
        start_at: format(startDate, "yyyy-MM-dd HH:mm"),
        end_at: format(endDate, "yyyy-MM-dd HH:mm"),
        is_Locked: schedule.isLocked,
        description: schedule.description,
        user_id: schedule.userId,
        schedule_kind_id: schedule.scheduleKindId,
      });
      setStartDay(format(startDate, "yyyy-MM-dd"));
      setStartTime({
        ...startTime,
        startHour: format(startDate, "HH"),
        startMinutes: format(startDate, "mm"),
      });
      setEndTime({
        ...endTime,
        endHour: format(endDate, "HH"),
        endMinutes: format(endDate, "mm"),
      });
    }
  }, [schedule, isOpen]);

  const handleClose = () => {
    clearErrors();
    onClose();
  };

  const handleStartChange = (e: ChangeEvent<HTMLInputElement>) => {
    setStartDay(e.target.value);
  };

  const timeCheck =
    new Date(editSchedule.start_at) >= new Date(editSchedule.end_at);

  const handleDelete = async () => {
    try {
      const token = await auth.currentUser?.getIdToken(true);
      const props: BaseClientWithAuthType = {
        method: "delete",
        url: `/schedules/${editSchedule?.id}`,
        token: token!,
      };
      const res = await BaseClientWithAuth(props);
      console.log(res.data);
      onClose();
      CloseDeleteModal();
      showMessage({ title: "削除しました", status: "warning" });
      location.reload();
    } catch (e: any) {
      console.log(e);
    }
  };

  const handleonSubmit = () => {
    const updateSchedule = async () => {
      try {
        if (schedule) {
          if (timeCheck) {
            errorModalOpen("終了時刻が開始時刻より早く設定されています");
          } else {
            const token = await auth.currentUser?.getIdToken(true);
            const data = {
              schedule: {
                start_at: editSchedule.start_at,
                end_at: editSchedule.end_at,
                is_Locked: editSchedule.is_Locked,
                description: editSchedule.description,
                user_id: editSchedule.user_id,
                schedule_kind_id: editSchedule.schedule_kind_id,
              },
            };
            const props: BaseClientWithAuthType = {
              method: "patch",
              url: `/schedules/${schedule.id}`,
              token: token!,
              params: data,
            };
            const res = await BaseClientWithAuth(props);
            if (weeklySchedules && setWeeklySchedules) {
              const weeklyIndex = weeklySchedules.findIndex(
                (schedule) => schedule.id === res.data.id
              );
              weeklySchedules[weeklyIndex] = res.data;
              setWeeklySchedules([...weeklySchedules]);
            }

            if (dailySchedules && setDailySchedules) {
              const dailyIndex = dailySchedules.findIndex(
                (schedule) => schedule.id === res.data.id
              );
              dailySchedules[dailyIndex] = res.data;
              setDailySchedules([...dailySchedules]);
            }
            onClose();
            setEditSchedule({
              id: 0,
              start_at: "",
              end_at: "",
              is_Locked: false,
              description: "",
              user_id: 0,
              schedule_kind_id: 0,
            });
            showMessage({ title: "更新しました", status: "success" });
          }
        }
      } catch (e: any) {
        console.log(e.response.data.data.base[0]);
        errorModalOpen(e.response.data.data.base[0]);
      }
    };
    updateSchedule();
  };

  return (
    <>
      {!loading && schedule && loginUser && (
        <>
          <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader m={"auto"} fontSize="2xl">
                Edit Schedule
              </ModalHeader>
              <ModalCloseButton />

              <form onSubmit={handleSubmit(handleonSubmit)}>
                <ModalBody>
                  <Stack spacing={3}>
                    <SelectForm
                      title="User"
                      name="user_id"
                      handleonChange={handleonChange}
                      teamUsers={teamUser}
                      value={editSchedule.user_id}
                      message="Userが入力されていません"
                      isDisabled={isDisabled}
                    />
                    <Box>
                      <InputGroup>
                        <InputLeftAddon
                          w="100px"
                          justifyContent={"center"}
                          children="日時"
                          bg="cyan.400"
                          color="white"
                          fontWeight="bold"
                        />
                        <Input
                          type="date"
                          value={startDay}
                          name="startDay"
                          onChange={handleStartChange}
                          disabled={isDisabled}
                        />
                      </InputGroup>
                    </Box>
                    <Box>
                      <InputGroup>
                        <InputLeftAddon
                          children="開始"
                          bg="cyan.600"
                          color="white"
                          fontWeight="bold"
                        />
                        <Select
                          name="startHour"
                          placeholder="時間"
                          value={startTime.startHour}
                          onChange={handleStartTimeChange}
                          disabled={isDisabled}
                        >
                          {hours && (
                            <>
                              {hours.map((hour, i) => (
                                <option key={i} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </>
                          )}
                        </Select>
                        <Select
                          name="startMinutes"
                          placeholder="分"
                          value={startTime.startMinutes}
                          onChange={handleStartTimeChange}
                          disabled={isDisabled}
                        >
                          {minutes && (
                            <>
                              {minutes.map((minute, i) => (
                                <option key={i} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </>
                          )}
                        </Select>
                      </InputGroup>
                    </Box>

                    <Box>
                      <InputGroup>
                        <InputLeftAddon
                          children="終了"
                          bg="cyan.600"
                          color="white"
                          fontWeight="bold"
                        />
                        <Select
                          name="endHour"
                          placeholder="時間"
                          value={endTime.endHour}
                          onChange={handleEndTimeChange}
                          disabled={isDisabled}
                        >
                          {hours && (
                            <>
                              {hours.map((hour, i) => (
                                <option key={i} value={hour}>
                                  {hour}
                                </option>
                              ))}
                            </>
                          )}
                        </Select>
                        <Select
                          name="endMinutes"
                          placeholder="分"
                          value={endTime.endMinutes}
                          onChange={handleEndTimeChange}
                          disabled={isDisabled}
                        >
                          {minutes && (
                            <>
                              {minutes.map((minute, i) => (
                                <option key={i} value={minute}>
                                  {minute}
                                </option>
                              ))}
                            </>
                          )}
                        </Select>
                      </InputGroup>
                    </Box>

                    <SelectForm
                      title="カテゴリ"
                      name="schedule_kind_id"
                      handleonChange={handleonChange}
                      tasks={tasks}
                      value={editSchedule.schedule_kind_id}
                      message="カテゴリーが入力されていません"
                      isDisabled={isDisabled}
                    />

                    <InputGroup>
                      <InputLeftAddon
                        w={"100px"}
                        justifyContent="center"
                        fontWeight={"bold"}
                        children="詳細"
                        bg="cyan.400"
                        color="white"
                      />
                      <Textarea
                        name="description"
                        placeholder="詳細"
                        rows={1}
                        onChange={handleonChange}
                        value={editSchedule.description}
                        disabled={isDisabled}
                      />
                    </InputGroup>
                    <Checkbox
                      isChecked={editSchedule.is_Locked}
                      name="is_Locked"
                      onChange={() =>
                        setEditSchedule({
                          ...editSchedule,
                          is_Locked: !editSchedule.is_Locked,
                        })
                      }
                      disabled={isDisabled}
                    >
                      Locked
                    </Checkbox>
                  </Stack>
                </ModalBody>
                <ModalFooter>
                  {!schedule.isLocked && (
                    <>
                      <Box mr={2}>
                        <FormButton type="submit" color="cyan" size="lg">
                          Edit
                        </FormButton>
                      </Box>
                      <PrimaryButton
                        onClick={OpenDeleteModal}
                        size="lg"
                        color="red"
                      >
                        Delete
                      </PrimaryButton>
                    </>
                  )}
                  {schedule.isLocked &&
                    loginUser.id === editSchedule.user_id && (
                      <>
                        <Box mr={2}>
                          <FormButton type="submit" color="cyan" size="lg">
                            Edit
                          </FormButton>
                        </Box>
                        <PrimaryButton
                          onClick={OpenDeleteModal}
                          size="lg"
                          color="red"
                        >
                          Delete
                        </PrimaryButton>
                      </>
                    )}
                  {schedule.isLocked &&
                    loginUser.id !== editSchedule.user_id && (
                      <Text>この予定はロックされています</Text>
                    )}
                </ModalFooter>
              </form>
            </ModalContent>
          </Modal>
          <DeleteModal
            isOpen={isDeleteModal}
            onClose={CloseDeleteModal}
            handleDelete={handleDelete}
          />
          <ErrorMessageModal
            isOpen={isErrorMessage}
            onClose={errorModalClose}
            message={message}
          />
        </>
      )}
    </>
  );
});

export default EditScheduleModal;
