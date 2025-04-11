"use client";

import { createContext, ReactNode, useContext, useReducer } from "react";
import { Tweet } from "../types";

type State = {
  tweets: Array<Tweet>;
};

type Action =
  | { type: "SET_TWEETS"; payload: Array<Tweet> }
  | { type: "LIKE_TWEET"; payload: { id: number; userId: number } };

type Dispatch = (action: Action) => void;

type ReducerContextType = {
  state: State;
  dispatch: Dispatch;
};

export const ReducerContext = createContext<ReducerContextType | undefined>(
  undefined
);

export const useReducerContext = () => {
  const context = useContext(ReducerContext);
  if (!context) {
    throw new Error("useReducerContext must be used within an AppProvider");
  }
  return context;
};

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "SET_TWEETS":
      return {
        ...state,
        tweets: action.payload,
      };
    case "LIKE_TWEET":
      return {
        ...state,
        tweets: state.tweets.map((tweet) =>
          tweet._id === action.payload.id
            ? { ...tweet, likes: [...tweet.likes, action.payload.userId] }
            : tweet
        ),
      };
    default:
      return state;
  }
};

export const ReducerProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    tweets: [],
  });

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      {children}
    </ReducerContext.Provider>
  );
};
