"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/about-me", label: "About Me" },
  { href: "/projects", label: "Projects" },
  { href: "/contact-me-server-form", label: "Contact" },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2">
      {links.map(({ href, label }) => {
        const active =
          href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`text-sm transition-opacity ${
              active
                ? "font-semibold text-foreground"
                : "text-foreground/60 hover:text-foreground"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
