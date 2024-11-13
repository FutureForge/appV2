import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { iconButtonStyles } from './variants'
import { VariantProps } from 'tailwind-variants'

/* -----------------------------------------------------------------------------
 * Button Types
 * ---------------------------------------------------------------------------*/

type ButtonElements = React.ElementRef<'button'>
type ButtonPrimitiveProps = React.ComponentPropsWithoutRef<'button'>
type IconButtonVariants = VariantProps<typeof iconButtonStyles>

type ButtonProps = ButtonPrimitiveProps &
  IconButtonVariants & {
    asChild?: boolean
  }

/* ----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/

const IconButton = React.forwardRef<ButtonElements, ButtonProps>((props, ref) => {
  const { asChild = false, size, shape, variant, className, ...buttonProps } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      {...buttonProps}
      className={iconButtonStyles({ size, shape, className, variant })}
      ref={ref}
    />
  )
})

IconButton.displayName = 'IconButton'

/* ----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export { IconButton }
