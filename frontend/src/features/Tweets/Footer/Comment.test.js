import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Comment from "./Comment";

const mockOnSubmit = jest.fn();
const mockSetForm = jest.fn();

const initialForm = {
  isOpen: false,
  comment: "",
};

describe("Comment", () => {
  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockSetForm.mockClear();

    render(
      <Comment
        commentsAmount={5}
        onSubmit={mockOnSubmit}
        form={initialForm}
        setForm={mockSetForm}
      />
    );
  });

  it("Show how many comment have", () => {
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("Should show form when click the button", () => {
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(mockSetForm).toHaveBeenCalledWith(expect.any(Function));

    const updateFn = mockSetForm.mock.calls[0][0];
    const result = updateFn({ isOpen: false, comment: "" });
    expect(result.isOpen).toBe(true);
  });

  it("Should submit the form", () => {
    mockOnSubmit();
    expect(mockOnSubmit).toHaveBeenCalled();
  });
});
