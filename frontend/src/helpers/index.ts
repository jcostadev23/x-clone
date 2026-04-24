import { Action } from "@/hooks/useReducer";
import { getAllTweets } from "@/utils/apiCalls";
import { ActionsType } from "./reducer";

export const fetchAndSetTweets = async (
  startLoading: () => void,
  stopLoading: () => void,
  dispatch: React.Dispatch<Action>
) => {
  startLoading();
  const tweets = await getAllTweets();
  stopLoading();

  if (tweets) {
    dispatch({ type: ActionsType.SET_TWEETS, payload: tweets });
  }
};
