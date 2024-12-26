import { DetailedHTMLProps, HTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

export const Title = (
  props: DetailedHTMLProps<
    HTMLAttributes<HTMLHeadingElement>,
    HTMLHeadingElement
  > & { size: "lg" | "md" }
) => {
  const { size, className = "", ...htmlProps } = props;

  const headingProps = {
    ...htmlProps,
  };

  return size === "lg" ? (
    <h1
      {...headingProps}
      className={twMerge(
        "font-bold leading-tight tracking-tighter title-lg text-center",
        className
      )}
    />
  ) : (
    <h2
      {...headingProps}
      className={twMerge(
        "font-bold leading-tight tracking-tighter title-md text-center",
        className
      )}
    />
  );
};
