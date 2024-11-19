/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { ReactNode, forwardRef, useEffect, useRef } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '../../utils';

type TooltipContentProps = React.ComponentProps<typeof TooltipPrimitive.Content>;

type TooltipProps<T = any> = {
  children: ReactNode;
  content: T;
  delayDuration?: number;
  asChild?: boolean;
} & Omit<TooltipContentProps, 'children'>;

export const Tooltip = forwardRef<HTMLButtonElement, TooltipProps>((props, ref) => {
  const {
    children,
    content,
    delayDuration = 300,
    asChild = true,
    className,
    ...contentProps
  } = props;
  const prevActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleFocus = (event: FocusEvent) => {
      const { target } = event;
      prevActiveElement.current = target as HTMLElement;
    };
    window.addEventListener('focusin', handleFocus);
    return () => window.removeEventListener('focusin', handleFocus);
  }, []);

  return (
    <TooltipPrimitive.Root delayDuration={delayDuration}>
      <TooltipPrimitive.Trigger
        ref={ref}
        asChild={asChild}
        onFocus={(event) => {
          if (prevActiveElement.current === event.target) {
            event.preventDefault();
          }
        }}
      >
        {children}
      </TooltipPrimitive.Trigger>

      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          className={cn(
            'bg-tertiary border border-border rounded-[.5rem] text-white p-2.5 text-sm z-[100]',
            'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
            className,
          )}
          {...contentProps}
        >
          {content}
          <TooltipPrimitive.Arrow className="fill-white/15" />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
});

Tooltip.displayName = 'Tooltip';

