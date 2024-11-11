import { tv } from 'tailwind-variants'

export const toggleItemStyles = tv(
  {
    base: 'text-muted-foreground rounded-lg h-[30px] transition duration-200 ease-out flex-shrink-0 px-2 flex items-center text-xs font-medium',
    variants: {
      variant: {
        filled:
          'border data-[state=off]:border-border data-[state=on]:border-primary data-[state=on]:bg-background data-[state=on]:text-white data-[state=off]:bg-secondary data-[state=off]:hover:bg-terciary',
        select:
          'data-[state=off]:hover:bg-hover data-[state=on]:bg-background data-[state=on]:text-white',
      },
    },
    defaultVariants: {
      variant: 'filled',
    },
  },
  { responsiveVariants: true },
)
