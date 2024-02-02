import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

import { siteConfig } from "@/config/site";
import { fontSans } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/providers";
// import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header";
import { TailwindIndicator } from "@/components/ui/tailwind-indicator";
import { Toaster } from "sonner";

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
          elements: {
            userButtonAvatarBox: "w-6 h-6 -mt-1",
          },
        }}
      >
        <html lang="en" suppressHydrationWarning>
          <head />
          <body
            className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
            )}
          >
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <Toaster />
                {/* <SiteFooter /> */}
              </div>
              <TailwindIndicator />
            </ThemeProvider>
            {/* <ThemeSwitcher /> */}
            {/* <DefaultToaster /> */}
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
