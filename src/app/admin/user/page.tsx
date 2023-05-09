"use client";
import { app } from "../../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";
import { TeamType } from "@/types/api/team";
import { useAuthContext } from "@/provider/AuthProvider";
import {
  Box,
  Divider,
  InputGroup,
  InputLeftAddon,
  Select,
  useDisclosure,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import UserCard from "@/components/organisms/users/UserCard";
import { useGetTeams } from "@/hooks/useGetTeams";
import DeleteModal from "@/components/organisms/modal/deleteModal";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { GetUserType } from "@/types/api/user";
import PrimaryButton from "@/components/atoms/PrimaryButton";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";

const DeleteUser = () => {
  const auth = getAuth(app);
  const router = useRouter();
  const { loginUser } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 1,
    name: "",
  });
  const [targetUser, setTargetUser] = useState<GetUserType>({
    id: 0,
    name: "",
    email: "",
    uid: "",
    role: "",
    teamId: 0,
  });
  const { teams, getTeamsWithoutAuth } = useGetTeams();
  const { teamUser } = useGetTeamUsers(targetTeam.id);
  const handleSelectChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const target = e.target;
      const name = target.name;
      const value = target.value;
      setTargetTeam({ ...targetTeam, [name]: value });
    },
    [targetTeam]
  );

  const onClickOpen = useCallback(
    (user: GetUserType) => {
      setTargetUser(user);
      onOpen();
    },
    [targetUser, onOpen]
  );

  const handleDelete = async () => {
    try {
      if (loginUser) {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { user_id: loginUser.id };
        const props: BaseClientWithAuthType = {
          method: "delete",
          url: `/users/${targetUser.id}`,
          token: token!,
          params: data,
        };
        await BaseClientWithAuth(props);
        onClose();
        location.reload();
      }
    } catch (e: any) {
      console.log(e);
    }
  };

  useEffect(() => {
    getTeamsWithoutAuth();
  }, []);
  return (
    <>
      <InputGroup w="500px" m={"auto"} mt={2} mb={5}>
        <InputLeftAddon
          children="team"
          bg="cyan.600"
          color="white"
          fontSize={"lg"}
          fontWeight={"bold"}
        />
        <Select name="id" onChange={handleSelectChange}>
          <option key={0} value={1}>
            ALL
          </option>
          {teams && (
            <>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </>
          )}
        </Select>
      </InputGroup>
      <Divider borderColor={"gray.400"} />
      <Wrap spacing={6} m={6}>
        {teamUser.map((user) => (
          <WrapItem key={user.id}>
            <Box>
              <UserCard
                user={user}
                loginUser={loginUser}
                onClick={() => {
                  onClickOpen(user);
                }}
                title="Delete"
              />
            </Box>
          </WrapItem>
        ))}
        <WrapItem>
          <Box
            display={"flex"}
            alignContent="center"
            justifyContent={"center"}
            w="240px"
            h={"303px"}
            alignItems={"center"}
          >
            <PrimaryButton
              size="lg"
              color="green"
              onClick={() => {
                router.push("/admin/");
              }}
            >
              <ChevronLeftIcon />
              戻る
            </PrimaryButton>
          </Box>
        </WrapItem>
      </Wrap>
      <DeleteModal
        isOpen={isOpen}
        onClose={onClose}
        handleDelete={handleDelete}
      />
    </>
  );
};

export default DeleteUser;
