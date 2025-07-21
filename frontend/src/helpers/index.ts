import { Action } from "@/hooks/useReducer";
import { getAllTweets } from "@/utils/apiCalls";
import { ActionsType } from "./reducer";

export const fetchAndSetTweets = async (
  setIsLoading: (loading: boolean) => void,
  dispatch: React.Dispatch<Action>
) => {
  setIsLoading(true);
  const tweets = await getAllTweets();
  setIsLoading(false);

  if (tweets) {
    dispatch({
      type: ActionsType.SET_TWEETS,
      payload: tweets,
    });
  }
};
