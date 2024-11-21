// import * as React from 'react'
// import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
// import { cn } from '../../utils'


// const ScrollArea = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.Root>,
//   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
//     rootClassName?: string
//   }
// >(({ className, rootClassName, children, ...props }, ref) => (
//   <ScrollAreaPrimitive.Root className={cn('relative h-full w-full overflow-hidden', rootClassName)}>
//     <ScrollAreaPrimitive.Viewport
//       ref={ref}
//       className={cn('h-full w-full rounded-[inherit]', className)}
//       {...props}
//     >
//       {children}
//     </ScrollAreaPrimitive.Viewport>
//     <ScrollBar />
//     <ScrollAreaPrimitive.Corner />
//   </ScrollAreaPrimitive.Root>
// ))
// ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName

// const ScrollBar = React.forwardRef<
//   React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
//   React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
// >(({ className, orientation = 'vertical', ...props }, ref) => (
//   <ScrollAreaPrimitive.ScrollAreaScrollbar
//     ref={ref}
//     orientation={orientation}
//     className={cn(
//       'flex touch-none select-none transition-colors',
//       orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent p-[1px]',
//       orientation === 'horizontal' && 'h-2.5 border-t border-t-transparent p-[1px]',
//       className,
//     )}
//     {...props}
//   >
//     <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
//   </ScrollAreaPrimitive.ScrollAreaScrollbar>
// ))
// ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName

// export { ScrollArea, ScrollBar }

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'
import { cn } from '../../utils'

/* ----------------------------------------------------------------------------
 * ScrollAreaRoot
 * --------------------------------------------------------------------------*/

type ScrollAreaElement = React.ComponentRef<typeof ScrollAreaPrimitive.Root>
type ScrollAreaPrimitiveProps = React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>

export interface ScrollAreaProps extends ScrollAreaPrimitiveProps {
  rootClassName?: string
}

/* ----------------------------------------------------------------------------
 * ScrollAreaRoot
 * --------------------------------------------------------------------------*/

const SCROLLAREA_NAME = 'ScrollAreaRoot'

const Root = React.forwardRef<ScrollAreaElement, ScrollAreaProps>((props, ref) => {
  const { className, rootClassName, children, type, ...rootProps } = props

  return (
    <ScrollAreaPrimitive.Root
      type={type}
      className={cn('relative h-full w-full overflow-hidden', rootClassName)}
    >
      <ScrollAreaPrimitive.Viewport
        ref={ref}
        className={cn('h-full w-full rounded-[inherit] [&>div]:h-full', className)}
        {...rootProps}
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <Bar orientation="vertical" />
      <Bar orientation="horizontal" />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
})

Root.displayName = SCROLLAREA_NAME

/* ----------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * --------------------------------------------------------------------------*/

type ScrollBarElement = React.ComponentRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
type ScrollBarPrimitiveProps = React.ComponentPropsWithoutRef<
  typeof ScrollAreaPrimitive.ScrollAreaScrollbar
>
export interface ScrollBarProps extends ScrollBarPrimitiveProps {}

/* ----------------------------------------------------------------------------
 * ScrollAreaScrollbar
 * --------------------------------------------------------------------------*/

const SCROLLBAR_NAME = 'Scrollbar'

const Bar = React.forwardRef<ScrollBarElement, ScrollBarProps>((props, ref) => {
  const { className, orientation = 'vertical', ...scrollBarProps } = props

  return (
    <ScrollAreaPrimitive.Scrollbar
      ref={ref}
      orientation={orientation}
      className={cn(
        'flex touch-none select-none transition-colors p-[1px]',
        orientation === 'vertical' && 'w-2.5',
        orientation === 'horizontal' && 'flex-col h-2.5 m-1',
        className,
      )}
      {...scrollBarProps}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-muted-foreground" />
    </ScrollAreaPrimitive.Scrollbar>
  )
})

Bar.displayName = SCROLLBAR_NAME

/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/
export const ScrollArea = Object.assign({}, { Root, Bar });
// export const ScrollArea = {
//   Root,
//   Bar,
// }
