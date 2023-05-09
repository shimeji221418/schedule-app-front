export type scheduleType = {
  id: number;
  startAt: Date;
  endAt: Date;
  isLocked: boolean;
  description: string;
  userId: number;
  scheduleKindId: number;
  scheduleKind?: { id: number; name: string; color: string };
};

export type NewScheduleType = {
  start_at: string;
  end_at: string;
  is_Locked: boolean;
  description: string;
  user_id: number;
  schedule_kind_id: number;
};

export type EditScheduleType = NewScheduleType & { id: number };
