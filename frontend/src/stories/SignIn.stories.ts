import type { Meta, StoryObj } from "@storybook/react";
import SignIn from "../app/signin/page";

const meta = {
  title: "Example/UserPage",
  component: SignIn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SignIn>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
