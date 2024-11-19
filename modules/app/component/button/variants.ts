import { tv } from 'tailwind-variants'

export const buttonStyles = tv(
  {
    base: "justify-center items-center font-medium duration-300 ease-out disabled:opacity-50 pt-0.5 flex gap-2 w-max disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary select-none focus-visible:outline-none outline-none",
    variants: {
      variant: {
        primary:
          "bg-[linear-gradient(180deg,#6B59C8_0%,#523DBF_100%)] text-white hover:brightness-125 hover:opacity-100 hover:shadow-new-accent/25 disabled:opacity-25 disabled:pointer-events-none",
        secondary:
          "bg-border text-white border border-border hover:bg-border/50",
        tertiary: "bg-card border border-border hover:bg-card/75",
        error: "bg-error text-white hover:opacity-75",
        outline:
          "bg-card text-foreground px-3 rounded-[30px] border border-border gap-2",
      },
      shape: {
        square: "rounded-lg",
        circle: "rounded-full",
      },
      size: {
        lg: "h-10 px-3 text-sm",
        md: "h-[2.125rem] px-3 text-sm",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: {
      variant: "primary",
      shape: "circle",
      size: "lg",
    },
  },
  { responsiveVariants: true }
);
