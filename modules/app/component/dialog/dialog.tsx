"use client";

import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Drawer } from "vaul";
import { useMediaQuery } from "@uidotdev/usehooks";

import XIcon from "@/assets/close.svg";

import { cn } from "../../utils";
import { ScrollArea } from "../scroll-area";
import { IconButton } from "../icon-button";

/* -------------------------------------------------------------------------------------------------
 * Root
 * -----------------------------------------------------------------------------------------------*/

type RootProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Root> & {
  nested?: boolean;
};

export const Root = (props: RootProps) => {
  const { nested = false, ...rootProps } = props;
  const isMobile = useMediaQuery("(max-width: 440px)");
  const DrawerRoot = nested ? Drawer.NestedRoot : Drawer.Root;
  const RootWrapper = isMobile ? DrawerRoot : DialogPrimitive.Root;
  return <RootWrapper {...rootProps} />;
};

/* -------------------------------------------------------------------------------------------------
 * Trigger
 * -----------------------------------------------------------------------------------------------*/

type TriggerElement = ElementRef<typeof DialogPrimitive.Trigger>;
type TriggerProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Trigger>;

export const Trigger = forwardRef<TriggerElement, TriggerProps>(
  (props, ref) => {
    const { asChild = true, ...triggerProps } = props;
    const isMobile = useMediaQuery("(max-width: 440px)");
    const TriggerWrapper = isMobile ? Drawer.Trigger : DialogPrimitive.Trigger;
    return <TriggerWrapper asChild={asChild} {...triggerProps} ref={ref} />;
  }
);

Trigger.displayName = "DialogTrigger";

/* -------------------------------------------------------------------------------------------------
 * Content
 * -----------------------------------------------------------------------------------------------*/

type ContentElement = ElementRef<typeof DialogPrimitive.Content>;
type ContentProps = Omit<
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
  "onAnimationEnd"
>;

export const Content = forwardRef<ContentElement, ContentProps>(
  (props, ref) => {
    const isMobile = useMediaQuery("(max-width: 440px)");
    return isMobile ? (
      <DrawerContent {...props} ref={ref} />
    ) : (
      <DialogContent {...props} ref={ref} />
    );
  }
);

Content.displayName = "DialogContent";

const DialogContent = forwardRef<ContentElement, ContentProps>((props, ref) => {
  const { className, ...contentProps } = props;
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-background/80 backdrop-blur flex items-center justify-center data-[state=open]:animate-overlayShow data-[state=closed]:animate-overlayHide px-4">
        <DialogPrimitive.Content
          className={cn(
            "bg-card border border-border rounded-3xl max-h-[95vh] flex flex-col",
            "data-[state=open]:animate-dialogShow data-[state=closed]:animate-dialogHide",
            className
          )}
          {...contentProps}
          onPointerDownOutside={(event) => {
            contentProps.onPointerDownOutside?.(event);
            const target = event.target as HTMLElement;
            if (target.closest("[data-sonner-toast]")) {
              event.preventDefault();
            }
          }}
          ref={ref}
        />
      </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
  );
});

DialogContent.displayName = "DialogContent";

type DrawerContentElement = ElementRef<typeof Drawer.Content>;
type DrawerContentProps = ComponentPropsWithoutRef<typeof Drawer.Content>;

const DrawerContent = forwardRef<DrawerContentElement, DrawerContentProps>(
  (props, ref) => {
    const { className, ...contentProps } = props;
    return (
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/80" />
        <Drawer.Content
          className={cn(
            "bg-card flex flex-col rounded-t-2xl max-h-[96%] h-full fixed bottom-0 left-0 right-0 border border-border",
            className
          )}
          {...contentProps}
          onOpenAutoFocus={(event) => {
            contentProps.onOpenAutoFocus?.(event);
            event.preventDefault();
          }}
          ref={ref}
        />
      </Drawer.Portal>
    );
  }
);

DrawerContent.displayName = "DialogContent";

/* -------------------------------------------------------------------------------------------------
 * Body
 * -----------------------------------------------------------------------------------------------*/

type BodyElement = ElementRef<"div">;
type BodyProps = Omit<ComponentPropsWithoutRef<"div">, "dir">;

export const Body = forwardRef<BodyElement, BodyProps>((props, ref) => {
  const { className, ...bodyProps } = props;
  return (
    <div className="flex flex-1 overflow-auto" ref={ref}>
      <ScrollArea
        className={cn("p-4", className)}
        rootClassName="h-auto"
        {...bodyProps}
      />
    </div>
  );
});

Body.displayName = "DialogBody";

/* -------------------------------------------------------------------------------------------------
 * Header
 * -----------------------------------------------------------------------------------------------*/

type HeaderElement = ElementRef<"div">;
type HeaderProps = ComponentPropsWithoutRef<"div">;

export const Header = forwardRef<HeaderElement, HeaderProps>((props, ref) => {
  const { className, children, ...headerProps } = props;
  return (
    <div
      className={cn(
        "p-4 border-b border-border flex items-center justify-between gap-3.5",
        className
      )}
      {...headerProps}
      ref={ref}
    >
      <div>{children}</div>
      {/* TODO: add icon button */}
      <Dialog.Close asChild>
        <IconButton shape="square" size="sm" className="group rounded">
          <XIcon className="size-[11px] text-muted-foreground group-hover:text-muted-foreground transition-all duration-300 ease-in-out" />
        </IconButton>
      </Dialog.Close>
    </div>
  );
});

Header.displayName = "DialogHeader";

/* -------------------------------------------------------------------------------------------------
 * Footer
 * -----------------------------------------------------------------------------------------------*/

type FooterElement = ElementRef<"div">;
type FooterProps = ComponentPropsWithoutRef<"div">;

export const Footer = forwardRef<FooterElement, FooterProps>((props, ref) => {
  const { className, ...footerProps } = props;
  return (
    <div
      className={cn(
        "p-6 border-t border-border flex gap-3 justify-end",
        className
      )}
      {...footerProps}
      ref={ref}
    />
  );
});

Footer.displayName = "DialogFooter";

/* -------------------------------------------------------------------------------------------------
 * Title
 * -----------------------------------------------------------------------------------------------*/

type TitleElement = ElementRef<typeof DialogPrimitive.Title>;
type TitleProps = ComponentPropsWithoutRef<typeof DialogPrimitive.Title>;

export const Title = forwardRef<TitleElement, TitleProps>((props, ref) => {
  const isMobile = useMediaQuery("(max-width: 440px)");
  const TitleWrapper = isMobile ? Drawer.Title : DialogPrimitive.Title;
  return (
    <TitleWrapper
      {...props}
      ref={ref}
      className="text-foreground font-medium"
    />
  );
});

Title.displayName = "DialogTitle";

/* -------------------------------------------------------------------------------------------------
 * Description
 * -----------------------------------------------------------------------------------------------*/

type DescriptionElement = ElementRef<typeof DialogPrimitive.Description>;
type DescriptionProps = ComponentPropsWithoutRef<
  typeof DialogPrimitive.Description
>;

export const Description = forwardRef<DescriptionElement, DescriptionProps>(
  (props, ref) => {
    const { className, ...descriptionProps } = props;
    const isMobile = useMediaQuery("(max-width: 440px)");
    const DescriptionWrapper = isMobile
      ? Drawer.Description
      : DialogPrimitive.Description;

    return (
      <DescriptionWrapper
        className={cn("text-muted-foreground text-xs", className)}
        {...descriptionProps}
        ref={ref}
      />
    );
  }
);

Description.displayName = "DialogDescription";

export const Close = DialogPrimitive.Close;

export const Dialog = {
  Root,
  NestedRoot: Drawer.NestedRoot,
  Trigger,
  Content,
  Header,
  Body,
  Footer,
  Title,
  Description,
  Close,
};
