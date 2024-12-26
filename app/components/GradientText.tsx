import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const GradientText = (
  props: DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>
) => {
  return (
    <span
      {...props}
      className={twMerge(
        "bg-clip-text bg-gradient-to-r text-transparent",
        props.className
      )}
    />
  );
};
