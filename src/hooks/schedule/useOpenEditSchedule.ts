import { scheduleType } from "@/types/api/schedule";
import { useState } from "react";

export const useOpenEditSchedule = () => {
  const [targetSchedule, setTargetSchedule] = useState<scheduleType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openEditSchedule = (schedule: scheduleType) => {
    setTargetSchedule(schedule);
    setIsModalOpen(true);
  };
  const closeEditSchedule = () => {
    setIsModalOpen(false);
  };

  return { targetSchedule, isModalOpen, openEditSchedule, closeEditSchedule };
};
