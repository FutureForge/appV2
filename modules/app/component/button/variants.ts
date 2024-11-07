import { tv } from 'tailwind-variants'

export const buttonStyles = tv(
  {
    base: 'justify-center items-center font-medium duration-300 ease-out disabled:opacity-50 pt-0.5 flex gap-2 w-max disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary select-none focus-visible:outline-none outline-none',
    variants: {
      variant: {
        primary: 'bg-primary text-white hover:opacity-75',
        secondary: 'bg-border text-white border border-border hover:bg-border/50',
        error: 'bg-error text-white hover:opacity-75',
      },
      shape: {
        square: 'rounded-lg',
        circle: 'rounded-full',
      },
      size: {
        lg: 'h-10 px-3 text-sm',
        md: 'h-[2.125rem] px-3 text-sm',
        sm: 'h-8 px-3 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
      shape: 'circle',
      size: 'lg',
    },
  },
  { responsiveVariants: true },
)
