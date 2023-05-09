export type TeamType = {
  id: number;
  name: string;
  user?: [
    {
      id: number;
      name: string;
      email: string;
      uid: string;
      role: number;
      team_id: number;
    }
  ];
};

export type NewTeamType = Pick<TeamType, "name">;
