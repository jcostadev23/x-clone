"use client";

import React from "react";
import TextArea from "../../Form/TextArea";

type Props = {
  value: string;
  placeHolder: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
};
const Form: React.FC<Props> = ({ onSubmit, value, onChange, placeHolder }) => {
  return (
    <form onSubmit={onSubmit}>
      <TextArea value={value} onChange={onChange} placeholder={placeHolder} />
    </form>
  );
};

export default Form;
