import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Button from "../app/components/Button";

const meta = {
  title: "Example/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    backgroundColor: { control: "color" },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    type: "button",
    label: "Button",
    applyMinWidth: true,
    backgroundColor: "primary",
  },
};

export const Secondary: Story = {
  args: {
    type: "submit",
    label: "Submit",
    applyMinWidth: false,
    backgroundColor: "secondary",
  },
};

export const Danger: Story = {
  args: {
    type: "button",
    label: "Danger",
    applyMinWidth: false,
    backgroundColor: "danger",
  },
};
