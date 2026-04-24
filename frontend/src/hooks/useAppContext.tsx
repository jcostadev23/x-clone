"use client";

import { getMe } from "@/utils/apiCalls";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

type AppContextType = {
  user: { userId?: string; userName?: string };
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({});
  const loadingCount = useRef(0);

  const startLoading = useCallback(() => {
    loadingCount.current += 1;
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    loadingCount.current = Math.max(0, loadingCount.current - 1);
    if (loadingCount.current === 0) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      startLoading();
      const resp = await getMe();
      stopLoading();
      if (resp) setUser(resp);
    })();
  }, [startLoading, stopLoading]);

  return (
    <AppContext.Provider value={{ isLoading, startLoading, stopLoading, user }}>
      {children}
    </AppContext.Provider>
  );
};
