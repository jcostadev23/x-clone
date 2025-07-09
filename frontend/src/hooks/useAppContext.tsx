"use client";

import { getMe } from "@/utils/apiCalls";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type AppContextType = {
  user: { userId?: string; userName?: string };
  isLoading: boolean;
  setIsLoading: (param: boolean) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }

  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const resp = await getMe();
      setIsLoading(false);

      if (!resp) {
        return false;
      }

      setUser(resp);
    })();
  }, []);

  return (
    <AppContext.Provider value={{ isLoading, setIsLoading, user }}>
      {children}
    </AppContext.Provider>
  );
};
