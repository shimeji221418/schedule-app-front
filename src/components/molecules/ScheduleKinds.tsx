import { useAuthContext } from "@/provider/AuthProvider";
import { GetTaskType } from "@/types/api/schedule_kind";
import { Box, Button, Flex } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React, { FC } from "react";

type Props = {
  tasks: Array<GetTaskType>;
};

const ScheduleKinds: FC<Props> = (props) => {
  const router = useRouter();
  const { tasks } = props;
  const { loginUser } = useAuthContext();

  return (
    <>
      {loginUser && (
        <Flex justifyContent="end">
          {tasks.map((task) =>
            loginUser.role !== "admin" ? (
              <Box
                width="100px"
                height="auto"
                padding={1}
                marginRight={1}
                textAlign="center"
                bg={task.color}
                key={task.id}
              >
                {task.name}
              </Box>
            ) : (
              <Box key={task.id} height="auto">
                <Button
                  width="100px"
                  padding={1}
                  marginRight={1}
                  textAlign="center"
                  bg={task.color}
                  onClick={() =>
                    router.push(`/admin/schedule_kind/edit/${task.id}`)
                  }
                >
                  {task.name}
                </Button>
              </Box>
            )
          )}
          {loginUser.role === "admin" && (
            <>
              <Button onClick={() => router.push("/admin/schedule_kind/new")}>
                +
              </Button>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default ScheduleKinds;
