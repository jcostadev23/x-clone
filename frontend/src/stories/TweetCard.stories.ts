import type { Meta, StoryObj } from "@storybook/react";
import TweetCard from "../app/components/Tweets/TweetCard";

const meta = {
  title: "Example/TweetCard",
  component: TweetCard,
  parameters: {
    layout: "centered",
  },
  args: {
    tweet: {
      _id: 11111,
      userId: 22,
      userName: "Alfonso",
      date: "12/12/1986",
      description: "This is a story of tweets",
      comments: [{ id: 2, comment: "My first comment" }],
      likes: [2, 4, 5, 6],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TweetCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    tweet: {
      _id: 11111,
      userId: 22,
      userName: "Alfonso",
      date: "12/12/1986",
      description: "This is a story of tweets",
      comments: [{ id: 2, comment: "My first comment" }],
      likes: [2, 4, 5, 6],
    },
  },
};
