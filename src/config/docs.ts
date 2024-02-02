// import { MainNavItem, SidebarNavItem } from "types/nav"

import { MainNavItem, SidebarNavItem } from "@/types/nav";

interface DocsConfig {
  mainNav: MainNavItem[];
  sidebarNav: SidebarNavItem[];
}

export const docsConfig: DocsConfig = {
  mainNav: [
    {
      title: "Wine",
      href: "/wine/*",
    },
    {
      title: "Cellar",
      href: "/bottles-search/*",
    },
    // {
    //   title: "GitHub",
    //   href: "https://github.com/shadcn/ui",
    //   external: true,
    // },
  ],

  sidebarNav: [
    {
      title: "Cellar1",
      items: [
        {
          title: "Find",
          href: "/",
          items: [],
        },
        {
          title: "Add",
          href: "/",
          items: [],
        },
        {
          title: "Test",
          href: "/test",
          items: [],
        },
      ],
    },
  ],
};
