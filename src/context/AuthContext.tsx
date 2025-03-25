import React, { createContext, useReducer, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserDatabase } from "@/database/useUserDatabase";

type Props = {
  children: ReactNode;
};

type AuthContextData = {
  user: UserDatabase | null;
  authIsReady: boolean;
  dispatch: any;
};

export const AuthContext = createContext({} as AuthContextData);

const cleanStorage = async () => {
  await AsyncStorage.removeItem("@Auth:user");
};

export const authReducer = (
  state: any,
  action: { type: any; payload: any | undefined }
) => {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      cleanStorage();
      return { ...state, user: null };
    case "AUTH_IS_READY":
      return { user: action.payload, authIsReady: true };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  useEffect(() => {
    const getAuth = async () => {
      try {
        let user = await AsyncStorage.getItem("@Auth:user");

        if (user) {
          dispatch({
            type: "AUTH_IS_READY",
            payload: JSON.parse(user) as UserDatabase,
          });
        }
      } catch (e) {
        console.error(e);
      }
    };
    getAuth();
  }, []);

  console.log("AuthContext state:", state);

  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
