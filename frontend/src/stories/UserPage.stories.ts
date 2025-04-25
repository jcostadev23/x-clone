import type { Meta, StoryObj } from "@storybook/react";
import UserPage from "../app/user/page";

const meta = {
  title: "Example/UserPage",
  component: UserPage,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof UserPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
