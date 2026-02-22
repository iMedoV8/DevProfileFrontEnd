"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes"
import { usePathname } from "next/navigation"

// Pre-hydration script evaluates local storage synchronously ahead of React boundaries
const themeScript = `
  (function() {
    try {
      var localTheme = localStorage.getItem('devprofile-dashboard-theme');
      if (localTheme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        // Explicitly fallback to Light mode if no persistence exists, ignoring OS
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

function ThemeWatcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { setTheme, resolvedTheme } = useTheme()

  // Mount re-sync to fix Next.js App Router layout cache keeping stale <html> classes
  React.useEffect(() => {
    if (resolvedTheme) {
      setTheme(resolvedTheme)
    }
  }, [resolvedTheme, setTheme])

  return <>{children}</>
}

export function DashboardThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: themeScript }} suppressHydrationWarning />
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        enableColorScheme
        storageKey="devprofile-dashboard-theme"
        disableTransitionOnChange
        {...props}
      >
        <ThemeWatcher>
          {children}
        </ThemeWatcher>
      </NextThemesProvider>
    </>
  )
}
