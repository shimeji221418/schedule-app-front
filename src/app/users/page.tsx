"use client";
import { GetUserType } from "@/types/api/user";
import { app } from "../../../firebase";
import { getAuth } from "firebase/auth";
import React, { ChangeEvent, useCallback, useEffect, useState } from "react";

import UserCard from "@/components/organisms/users/UserCard";
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
import { useGetTeams } from "@/hooks/useGetTeams";
import { TeamType } from "@/types/api/team";
import UserDetailModal from "@/components/organisms/modal/UserDetailModal";
import { useGetTeamUsers } from "@/hooks/useGetTeamUsers";
import EditPasswordModal from "@/components/organisms/modal/EditPasswordModal";
import EditEmailModal from "@/components/organisms/modal/EditEmailModal";
import { useFormContext } from "react-hook-form";

const Users = () => {
  const auth = getAuth(app);
  const { loginUser } = useAuthContext();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const { teams, getTeamsWithoutAuth } = useGetTeams();
  const { clearErrors } = useFormContext();
  const [targetTeam, setTargetTeam] = useState<TeamType>({
    id: 0,
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
      console.log(targetUser);
      onOpen();
    },
    [targetUser, onOpen]
  );

  const openPassModal = useCallback(() => {
    setIsModalOpen(true);
    onClose();
  }, [isModalOpen]);

  const closePassModal = useCallback(() => {
    setIsModalOpen(false);
    clearErrors();
  }, [isModalOpen]);

  const openEmailModal = useCallback(() => {
    setIsEmailModalOpen(true);
    onClose();
  }, [isEmailModalOpen]);

  const closeEmailModal = useCallback(() => {
    setIsEmailModalOpen(false);
    clearErrors();
  }, [isModalOpen]);

  useEffect(() => {
    getTeamsWithoutAuth();
  }, []);
  return (
    <>
      {loginUser && (
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
              <option key={0} value={0}>
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
                <Box onClick={() => onClickOpen(user)}>
                  <UserCard user={user} loginUser={loginUser} />
                </Box>
              </WrapItem>
            ))}
          </Wrap>
          <UserDetailModal
            isOpen={isOpen}
            onClose={onClose}
            targetUser={targetUser}
            auth={auth}
            teams={teams}
            loginUser={loginUser}
            openPassModal={openPassModal}
            openEmailModal={openEmailModal}
          />
          <EditPasswordModal
            isModalOpen={isModalOpen}
            onClose={closePassModal}
            auth={auth}
            loginUser={loginUser}
          />
          <EditEmailModal
            isModalOpen={isEmailModalOpen}
            onClose={closeEmailModal}
            auth={auth}
            loginUser={loginUser}
          />
        </>
      )}
    </>
  );
};

export default Users;
