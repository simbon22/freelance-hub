"use client"

import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    
    // Aggiunge una classe temporanea per l'animazione
    document.documentElement.classList.add('theme-transitioning')
    
    setTimeout(() => {
      setTheme(newTheme)
    }, 0)
    
    // Rimuove la classe dopo la transizione
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
    }, 300)
  }

  if (!mounted) {
    return <Button variant="outline" size="sm">🌙</Button>
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleToggle}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </Button>
  )
}