import { tv } from 'tailwind-variants'

export const iconButtonStyles = tv(
  {
    base: "bg-secondary border border-border flex justify-center items-center disabled:cursor-default size-10 flex-shrink-0 hover:bg-background/25 duration-200 ease-out",
    variants: {
      variant: {
        ghost: "border-new-muted-text hover:bg-hover bg-new-muted-bg",
      },
      shape: {
        square: "rounded-lg",
        circle: "rounded-full",
      },
      size: {
        xl: "size-10",
        lg: "size-9",
        md: "size-8",
        sm: "size-6",
      },
    },
    defaultVariants: {
      shape: "square",
      size: "md",
    },
  },
  { responsiveVariants: true }
);
