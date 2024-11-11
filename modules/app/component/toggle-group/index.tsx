import * as Toggle from '@radix-ui/react-toggle-group'
import { ComponentProps, ElementRef, forwardRef } from 'react'

import { type VariantProps } from 'tailwind-variants'
import { toggleItemStyles } from './variants'
import { cn } from '../../utils'

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootElement = ElementRef<typeof Toggle.Root>
type RootProps = ComponentProps<typeof Toggle.Root>

export const Root = forwardRef<RootElement, RootProps>((props, ref) => {
  const { children, className, ...rootProps } = props
  return (
    <Toggle.Root ref={ref} className={cn('flex items-center gap-1', className)} {...rootProps}>
      {children}
    </Toggle.Root>
  )
})

Root.displayName = 'ToggleGroupRoot'

/* -------------------------------------------------------------------------------------------------
 * Item
 * -----------------------------------------------------------------------------------------------*/

type ItemVariants = VariantProps<typeof toggleItemStyles>
type ItemElement = ElementRef<typeof Toggle.Item>
type ItemProps = ComponentProps<typeof Toggle.Item> & {
  variant?: ItemVariants['variant']
}
export const Item = forwardRef<ItemElement, ItemProps>((props, ref) => {
  const { variant, disabled, className, children, ...itemProps } = props

  return (
    <Toggle.Item
      ref={ref}
      className={cn(toggleItemStyles({ variant, className }), { 'pointer-events-none': disabled })}
      {...itemProps}
    >
      {children}
    </Toggle.Item>
  )
})

Item.displayName = 'ToggleGroupItem'

export const ToggleGroup = Object.assign({}, { Root, Item })
