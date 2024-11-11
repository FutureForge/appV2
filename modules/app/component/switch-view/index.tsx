'use client'

import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '../../utils'


type SwitchViewProps = {
  active: boolean
  onChange: (value: string) => void
  falseoption: React.ReactNode
  trueoption: React.ReactNode
}

const SwitchViewFirstOption: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
SwitchViewFirstOption.displayName = 'SwitchViewFirstOption'

const SwitchViewSecondOption: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>
}
SwitchViewSecondOption.displayName = 'SwitchViewSecondOption'

const SwitchViewRoot = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & SwitchViewProps
>(({ className, active, onChange, ...props }, ref) => {
  return (
    <SwitchPrimitives.Root
      defaultChecked={active}
      checked={active}
      onCheckedChange={(value) => {
        if (value) return onChange('trueoption')
        return onChange('falseoption')
      }}
      className={cn(
        'relative peer inline-flex h-10 w-[76px] shrink-0 cursor-pointer items-center rounded-lg border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-secondary disabled:cursor-not-allowed disabled:opacity-50 bg-new-muted-bg',
        className,
      )}
      {...props}
      ref={ref}
    >
      <div className="absolute inset-0 flex items-center justify-center w-full z-10">
        {props.children}
      </div>
      <SwitchPrimitives.Thumb
        className={cn(
          'pointer-events-none block size-8 rounded-md ring-0 transition-transform data-[state=checked]:translate-x-[37px] data-[state=unchecked]:translate-x-1 bg-background',
        )}
      />
    </SwitchPrimitives.Root>
  )
})

SwitchViewRoot.displayName = 'SwitchViewRoot'

export const SwitchView = Object.assign(
  {},
  {
    Root: SwitchViewRoot,
    FirstOption: SwitchViewFirstOption,
    SecondOption: SwitchViewSecondOption,
  },
)
