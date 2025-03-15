import type { Meta, StoryObj } from "@storybook/react";
import ShowMorePosts from "../app/components/ShowMorePosts";

const meta = {
  title: "Example/ShowMorePosts",
  component: ShowMorePosts,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ShowMorePosts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
