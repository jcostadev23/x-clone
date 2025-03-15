import type { Meta, StoryObj } from "@storybook/react";
import PostTweet from "../app/components/Form/PostTweet";

const meta = {
  title: "Example/PostTweet",
  component: PostTweet,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PostTweet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
