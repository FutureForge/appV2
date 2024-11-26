import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import ChevronDownIcon from "@/assets/arrow-left-s-line.svg";
import { cn } from "../../utils";

/* ----------------------------------------------------------------------------
 * Trigger
 * --------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof RadixSelect.Trigger>;
type TriggerProps = ComponentPropsWithoutRef<typeof RadixSelect.Trigger>;

export const Trigger = forwardRef<TriggerElement, TriggerProps>(
  (props, ref) => {
    const { asChild = true, ...triggerProps } = props;

    return (
      <RadixSelect.Trigger {...triggerProps} ref={ref} asChild={asChild} />
    );
  }
);

Trigger.displayName = "SelectTrigger";

/* ----------------------------------------------------------------------------
 * Icon
 * --------------------------------------------------------------------------*/

type IconElement = ElementRef<typeof RadixSelect.Icon>;
type IconProps = ComponentPropsWithoutRef<typeof RadixSelect.Icon>;

export const Icon = forwardRef<IconElement, IconProps>((props, ref) => {
  return (
    <RadixSelect.Icon {...props} ref={ref}>
      <ChevronDownIcon className="rotate-[270deg]"/>
    </RadixSelect.Icon>
  );
});

Icon.displayName = "SelectIcon";

/* ----------------------------------------------------------------------------
 * Content
 * --------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof RadixSelect.Content>;
type ContentProps = ComponentPropsWithoutRef<typeof RadixSelect.Content>;

export const Content = forwardRef<ContentElement, ContentProps>(
  (props, ref) => {
    const {
      children,
      sideOffset = 4,
      position = "popper",
      className,
      ...contentProps
    } = props;

    return (
      <RadixSelect.Portal>
        <RadixSelect.Content
          position={position}
          sideOffset={sideOffset}
          className={cn(
            "bg-card rounded-xl min-w-[--radix-select-trigger-width]",
            // Animation enter
            "data-[state=open]:data-[side=top]:animate-slide-from-top data-[state=open]:data-[side=bottom]:animate-slide-from-bottom data-[state=open]:data-[side=left]:animate-slide-from-left data-[state=open]:data-[side=right]:animate-slide-from-right",
            // Animation out
            "data-[state=closed]:data-[side=top]:animate-slide-to-top data-[state=closed]:data-[side=bottom]:animate-slide-to-bottom data-[state=closed]:data-[side=left]:animate-slide-to-left data-[state=closed]:data-[side=right]:animate-slide-to-right",
            className
          )}
          {...contentProps}
          ref={ref}
        >
          <RadixSelect.Viewport className="p-1 relative space-y-1">
            {children}
          </RadixSelect.Viewport>
        </RadixSelect.Content>
      </RadixSelect.Portal>
    );
  }
);

Content.displayName = "SelectContent";

/* ----------------------------------------------------------------------------
 * Item
 * --------------------------------------------------------------------------*/

type ItemElement = ElementRef<typeof RadixSelect.Item>;
type ItemProps = ComponentPropsWithoutRef<typeof RadixSelect.Item>;

export const Item = forwardRef<ItemElement, ItemProps>((props, ref) => {
  const { children, className, ...itemProps } = props;
  return (
    <RadixSelect.Item
      className={cn(
        "flex items-center justify-between bg-transparent p-2 rounded-lg outline-none cursor-pointer gap-8",
        " data-[highlighted]:bg-tertiary",
        " data-[state=checked]:bg-tertiary",
        className
      )}
      {...itemProps}
      ref={ref}
    >
      <RadixSelect.ItemText>
        <div className="flex gap-2 items-center text-sm font-medium">
          {children}
        </div>
      </RadixSelect.ItemText>
      <RadixSelect.ItemIndicator className="SelectItemIndicator">
        <div className="size-1.5 bg-primary rounded-full" />
      </RadixSelect.ItemIndicator>
    </RadixSelect.Item>
  );
});

Item.displayName = "SelectItem";

/* ----------------------------------------------------------------------------
 * Exports
 * --------------------------------------------------------------------------*/

export const Root = RadixSelect.Root;
export const Value = RadixSelect.Value;

export const Select = Object.assign({}, { Root, Trigger, Icon, Value, Content, Item });