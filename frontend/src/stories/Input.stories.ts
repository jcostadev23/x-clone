import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import Input from "../components/Form/Input";

const meta = {
  title: "Example/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    label: "Text",
    size: "sm",
    onChange: fn(),
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    label: "Something",
    placeholder: "Storybook",
    size: "sm",
    value: "",
  },
};
