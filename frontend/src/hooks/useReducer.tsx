"use client";

import { createContext, ReactNode, useContext, useReducer } from "react";
import { State, Tweet } from "../types";
import { actions, ActionsType } from "@/helpers/reducer";

type Action =
  | { type: ActionsType.SET_TWEETS; payload: Array<Tweet> }
  | { type: ActionsType.LIKE_TWEET; payload: { id: string; userId: string } };

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
    case ActionsType.SET_TWEETS:
      return actions[action.type](state, action.payload);
    case ActionsType.LIKE_TWEET:
      return actions[action.type](state, action.payload);
    default:
      return state;
  }
};

export const ReducerProvider: React.FC<{
  children: ReactNode;
  tweets: Array<Tweet>;
}> = ({ children, tweets }) => {
  const [state, dispatch] = useReducer(reducer, {
    tweets,
  });

  return (
    <ReducerContext.Provider value={{ state, dispatch }}>
      {children}
    </ReducerContext.Provider>
  );
};
