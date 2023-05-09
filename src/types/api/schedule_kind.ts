export type GetTaskType = {
  id: number;
  name: string;
  color: string;
};

export type TaskType = Pick<GetTaskType, "name" | "color">;
