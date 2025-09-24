import React from "react"
import { Outlet } from "react-router"
import Navbar from "../components/Navbar"
import { ThemeProvider } from "~/components/theme-provider"
import { ThemeToggle } from "~/components/theme-toggle"

export default function RootLayout() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* Header con el switch */}
        <header className="flex justify-end p-4">
          <ThemeToggle />
        </header>

        {/* Navbar global */}
        <Navbar />
        {/* Contenido principal */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </ThemeProvider>
  )
}
