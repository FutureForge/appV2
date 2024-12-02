import React, { useState } from "react";
// icon
import ArrowLeft from "@/assets/arrow-narrow-left.svg";
import Link from "next/link";
import { TransitionLinks } from "../nav/transition-links";
import { usePathname } from "next/navigation";
import { cn } from "../../utils";

const Footer_Data = {
  marketplace: {
    title: "Marketplace",
    links: [
      {
        name: "Create",
        link: "/create",
      },
      {
        name: "Add Collections",
        link: "/add_collections",
      },
      {
        name: "Collections",
        link: "/collections",
      },
      {
        name: "Browse",
        link: "/browse",
      },
    ],
  },
  social: {
    title: "Join us",
    links: [
      {
        name: "X/Twitter",
        link: "https://x.com/mintmingles",
        external: true,
      },
      // {
      //   name: "Instagram",
      //   link: "",
      //   external: true,
      // },
      // {
      //   name: "Discord",
      //   link: "",
      //   external: true,
      // },
      // {
      //   name: "Farcaster",
      //   link: "",
      //   external: true,
      // },
    ],
  },
};

export function Footer() {
  const [email, setEmail] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };
  return (
    <div className="w-full py-20 flex items-center justify-between px-6 mt-28">
      <div className="w-full mx-auto flex items-start justify-between max-md:flex-col gap-12 ">
        {/* <div className="flex flex-col gap-6 max-md:w-full">
          <h4 className="font-medium text-2xl">Stay in the loop</h4>
          <div className="bg-tertiary flex rounded-xl focus-within:border-border focus-within:border py-3 px-4 w-full md:w-[400px]">
            <input
              onChange={handleChange}
              value={email}
              type="email"
              className="bg-transparent outline-none w-full placeholder:text-muted-foreground caret-primary placeholder:font-medium"
              placeholder="Your e-mail"
            />
            <button
              disabled={!email}
              aria-label="Subscribe to newsletter"
              className="flex justify-end disabled:cursor-not-allowed disabled:opacity-60 "
            >
              <ArrowLeft />
            </button>
          </div>
        </div> */}

        <FooterLinks
          title={Footer_Data.marketplace.title}
          links={Footer_Data.marketplace.links}
        />

        <FooterLinks
          title={Footer_Data.social.title}
          links={Footer_Data.social.links}
        />
      </div>
    </div>
  );
}

type FooterLinksProps = {
  title: string;
  links: { name: string; link: string; external?: boolean }[];
};

function FooterLinks({ title, links }: FooterLinksProps) {
  const pathname = usePathname();
  return (
    <div className="flex flex-col gap-6">
      <h4 className="font-medium text-2xl">{title}</h4>
      <ul className="space-y-2">
        {links.map((item) => {
          const Component = item.external ? Link : TransitionLinks;
          const isActive = !item.external && pathname === item.link;
          return (
            <li key={item.name}>
              <Component
                href={item.link}
                target={item.external ? "_blank" : "_self"}
                className={cn(
                  "text-muted-foreground hover:text-foreground duration-300 ease-in-out transition font-medium",
                  { "text-foreground": isActive }
                )}
              >
                {item.name}
              </Component>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
