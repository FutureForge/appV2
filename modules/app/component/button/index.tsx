import React from 'react'

import { Slot } from '@radix-ui/react-slot'
import { VariantProps } from 'tailwind-variants'
import { buttonStyles } from './variants'

/* -----------------------------------------------------------------------------
 * Button Types
 * ---------------------------------------------------------------------------*/

type ButtonElements = React.ElementRef<'button'>
type ButtonPrimitiveProps = React.ComponentPropsWithoutRef<'button'>
type ButtonVariants = VariantProps<typeof buttonStyles>

type ButtonProps = ButtonPrimitiveProps &
  ButtonVariants & {
    isLoading?: boolean
    variant?: ButtonVariants['variant']
    shape?: ButtonVariants['shape']
    asChild?: boolean
  }

/* ----------------------------------------------------------------------------
 * Component
 * ---------------------------------------------------------------------------*/

const Button = React.forwardRef<ButtonElements, ButtonProps>((props, ref) => {
  const { asChild = false, variant, shape, size, className, isLoading, disabled, ...buttonProps } = props

  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      disabled={isLoading ?? disabled}
      className={buttonStyles({ variant, shape, size, className })}
      ref={ref}
      {...buttonProps}
    />
  )
})

Button.displayName = 'Button'

/* ----------------------------------------------------------------------------
 * Export
 * ---------------------------------------------------------------------------*/

export { Button }
