import React from 'react'
import * as CheckboxPrimiteve from '@radix-ui/react-checkbox'
import Check from "@/assets/Check.svg"
import { cn } from '../../utils'

type CheckboxElement = React.ElementRef<typeof CheckboxPrimiteve.Root>
type CheckboxProps = React.ComponentPropsWithoutRef<typeof CheckboxPrimiteve.Root>

export const Checkbox = React.forwardRef<CheckboxElement, CheckboxProps>((props, ref) => {
  const { className, ...checkboxProps } = props

  return (
    <CheckboxPrimiteve.Root
      className={cn(
        'flex size-4 items-center justify-center rounded-full border border-muted-foreground text-muted-foreground',
        'data-[state=checked]:bg-primary data-[state=checked]:text-primary data-[state=checked]:border-transparent',
        className,
      )}
      defaultChecked
      ref={ref}
      {...checkboxProps}
    >
      <CheckboxPrimiteve.Indicator>
        <Check />
      </CheckboxPrimiteve.Indicator>
    </CheckboxPrimiteve.Root>
  )
})

Checkbox.displayName = 'Checkbox'
