import type { Meta, StoryObj } from "@storybook/react";
import MoreTweets from "../features/Tweets/MoreTweets";

const meta = {
  title: "Example/ShowMorePosts",
  component: MoreTweets,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MoreTweets>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
