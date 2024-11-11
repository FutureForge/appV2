
import React from 'react'
import { cn } from '../../utils'

type CardElement = React.ElementRef<'div'>
type CardElementProps = React.ComponentPropsWithoutRef<'div'>

export const Card = React.forwardRef<CardElement, CardElementProps>((props, ref) => {
  const { className, children, ...cardProps } = props

  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col bg-card rounded-3xl p-4 gap-4 border border-border',
        className,
      )}
      {...cardProps}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'
