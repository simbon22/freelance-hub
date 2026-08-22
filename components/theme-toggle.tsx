"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light"

    document.documentElement.classList.add('theme-transitioning')

    setTimeout(() => {
      setTheme(newTheme)
    }, 0)

    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 300)
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="sm" className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/70 hover:text-sidebar-foreground">
        <Moon size={14} />
        Tema
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
      className="w-full justify-start gap-2 bg-sidebar-accent text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/70 hover:text-sidebar-foreground"
    >
      {theme === "light" ? <Moon size={14} /> : <Sun size={14} />}
      {theme === "light" ? "Tema scuro" : "Tema chiaro"}
    </Button>
  )
}