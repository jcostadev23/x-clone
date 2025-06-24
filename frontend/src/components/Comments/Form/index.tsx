"use client";

import React from "react";
import TextArea from "../../Form/TextArea";
import Button from "../../Button";

type Props = {
  value: string;
  placeHolder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};
const Form: React.FC<Props> = ({ onSubmit, value, onChange, placeHolder }) => {
  return (
    <form className="flex flex-col justify-between h-full" onSubmit={onSubmit}>
      <TextArea value={value} onChange={onChange} placeholder={placeHolder} />
      <div className="flex justify-end m-2">
        <Button
          type="submit"
          label="Reply"
          applyMinWidth
          backgroundColor="secondary"
        />
      </div>
    </form>
  );
};

export default Form;
