import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { cn } from '@/utils/functions';

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof PopoverPrimitive.Trigger>;
type TriggerProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>;

const Trigger = forwardRef<TriggerElement, TriggerProps>((props, ref) => {
  const { asChild = true, ...triggerProps } = props;
  return <PopoverPrimitive.Trigger asChild={asChild} {...triggerProps} ref={ref} />;
});

Trigger.displayName = 'PopoverTrigger';

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof PopoverPrimitive.Content>;
type ContentProps = ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>;

const Content = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, ...contentProps } = props;
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          'font-sans border border-new-elements-border rounded-xl bg-new-secondary text-new-foreground',
          'origin-[--radix-popover-content-transform-origin]',
          // Animation enter
          'data-[state=open]:data-[side=top]:animate-slide-from-top data-[state=open]:data-[side=bottom]:animate-slide-from-bottom data-[state=open]:data-[side=left]:animate-slide-from-left data-[state=open]:data-[side=right]:animate-slide-from-right',
          // Animation out
          'data-[state=closed]:data-[side=top]:animate-slide-to-top data-[state=closed]:data-[side=bottom]:animate-slide-to-bottom data-[state=closed]:data-[side=left]:animate-slide-to-left data-[state=closed]:data-[side=right]:animate-slide-to-right',
          className,
        )}
        {...contentProps}
        ref={ref}
      />
    </PopoverPrimitive.Portal>
  );
});

Content.displayName = 'PopoverContent';

export const Popover = {
  Root: PopoverPrimitive.Root,
  Trigger,
  Anchor: PopoverPrimitive.Anchor,
  Content,
  Arrow: PopoverPrimitive.Arrow,
  Close: PopoverPrimitive.Close,
};
