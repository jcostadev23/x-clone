import { ChangeEvent } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

const Input: React.FC<Props> = ({ value, onChange }) => {
  const handleEvent = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <input
      className="text-gray-600 text-2xl w-full p-2 rounded-md outline-none bg-transparent"
      type="text"
      value={value}
      onChange={handleEvent}
      placeholder="What is happening?!"
    ></input>
  );
};

export default Input;
