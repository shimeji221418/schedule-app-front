"use client";
import { app } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { LoginUserType } from "@/types/api/user";
import { BaseClientWithAuth, BaseClientWithAuthType } from "@/lib/api/client";
import { Text } from "@chakra-ui/react";

export type AuthContextType = {
  loginUser: LoginUserType;
  userCheck: boolean;
  setUserCheck: Dispatch<SetStateAction<boolean>>;
  setLoginUser: Dispatch<SetStateAction<LoginUserType>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
};

type Props = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: FC<Props> = ({ children }) => {
  const auth = getAuth(app);
  const router = useRouter();
  const pathname = usePathname();
  const [loginUser, setLoginUser] = useState<LoginUserType>(null);
  const [userCheck, setUserCheck] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const value = {
    loginUser,
    userCheck,
    setUserCheck,
    setLoginUser,
    setLoading,
    loading,
  };
  const isLoginOrSignUpPage: boolean =
    pathname === "/login" || pathname === "/signup";

  const searchWord = "/admin";

  const isAdminPage: boolean = pathname!.indexOf(searchWord) > -1;

  const isAdmin = () => {
    if (isAdminPage && loginUser?.role === "general") {
      router.push("/");
    }
  };

  useEffect(() => {
    isAdmin();
  }, [loginUser]);

  useEffect(() => {
    const onCurrentUser = async () => {
      try {
        const token = await auth.currentUser?.getIdToken(true);
        const data = { uid: auth.currentUser?.uid };
        const config: BaseClientWithAuthType = {
          method: "get",
          url: "/users/current",
          token: token!,
          params: data,
        };
        if (auth.currentUser) {
          const res = await BaseClientWithAuth(config);
          setLoginUser(res.data);
        }
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    };

    const unsubscribed = onAuthStateChanged(auth, (resultUser) => {
      console.log(resultUser?.displayName);
      if (isLoginOrSignUpPage && resultUser) {
        router.push("/");
      }
      if (!isLoginOrSignUpPage && resultUser == null) {
        router.push("/login");
      }
      onCurrentUser();
    });
    unsubscribed();
  }, [userCheck]);

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <>
        <AuthContext.Provider value={value}>
          {!loading && children}
        </AuthContext.Provider>
      </>
    );
  }
};

export default AuthProvider;
