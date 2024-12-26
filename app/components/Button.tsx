import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { twMerge } from "tailwind-merge";

export const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => (
  <button
    type="button"
    {...props}
    className={twMerge(
      "text-gray-50 font-bold bg-primary-600 rounded-lg hover:bg-primary-500 w-fit px-4 py-2",
      props.className
    )}
  />
);
