'use client'

import { useEffect, useRef } from 'react'

interface Series {
  seed: number
  amp: number
  yOffset: number
  color: string
  width: number
  fill: boolean
  speed: number
}

interface Marker {
  series: Series
  x: number
  born: number
  life: number
}

function noisyY(x: number, seed: number, t: number) {
  return (
    Math.sin(x * 0.006 + seed + t) * 1 +
    Math.sin(x * 0.017 + seed * 1.7 + t * 1.3) * 0.45 +
    Math.sin(x * 0.041 + seed * 2.3 - t * 0.7) * 0.2
  )
}

export function LoginBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    const resize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let isDark = document.documentElement.classList.contains('dark')
    const observer = new MutationObserver(() => {
      isDark = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const lightSeries: Series[] = [
      { seed: 0, amp: 58, yOffset: 0.32, color: '47, 107, 70', width: 2.0, fill: true, speed: 0.01 },
      { seed: 2.1, amp: 38, yOffset: 0.56, color: '148, 98, 48', width: 1.4, fill: false, speed: 0.007 },
      { seed: 4.4, amp: 46, yOffset: 0.78, color: '110, 118, 128', width: 1.4, fill: false, speed: 0.013 },
    ]
    const darkSeries: Series[] = [
      { seed: 0, amp: 58, yOffset: 0.32, color: '110, 168, 130', width: 2.0, fill: true, speed: 0.01 },
      { seed: 2.1, amp: 38, yOffset: 0.56, color: '196, 150, 100', width: 1.4, fill: false, speed: 0.007 },
      { seed: 4.4, amp: 46, yOffset: 0.78, color: '150, 158, 168', width: 1.4, fill: false, speed: 0.013 },
    ]

    let t = 0
    let markers: Marker[] = []
    let rafId: number

    const spawnInterval = setInterval(() => {
      const series = isDark ? darkSeries : lightSeries
      const s = series[Math.floor(Math.random() * series.length)]
      const x = width * (0.15 + Math.random() * 0.7)
      markers.push({ series: s, x, born: t, life: 140 })
    }, 2600)

    const draw = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.035)' : 'rgba(0,0,0,0.028)'
      const spacing = 30
      for (let x = 0; x < width; x += spacing) {
        for (let y = 0; y < height; y += spacing) {
          ctx.fillRect(x, y, 1, 1)
        }
      }

      const series = isDark ? darkSeries : lightSeries

      series.forEach((s) => {
        const baseY = height * s.yOffset
        const points: [number, number][] = []
        for (let x = 0; x <= width; x += 5) {
          const y = baseY + noisyY(x, s.seed, t * s.speed) * s.amp
          points.push([x, y])
        }

        if (s.fill) {
          const grad = ctx.createLinearGradient(0, baseY - s.amp * 1.6, 0, height)
          grad.addColorStop(0, `rgba(${s.color}, 0.1)`)
          grad.addColorStop(1, `rgba(${s.color}, 0)`)
          ctx.beginPath()
          ctx.moveTo(points[0][0], height)
          points.forEach(([x, y]) => ctx.lineTo(x, y))
          ctx.lineTo(points[points.length - 1][0], height)
          ctx.closePath()
          ctx.fillStyle = grad
          ctx.fill()
        }

        ctx.beginPath()
        points.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)))
        ctx.strokeStyle = `rgba(${s.color}, ${s.fill ? 0.22 : 0.14})`
        ctx.lineWidth = s.width
        ctx.stroke()
      })

      markers = markers.filter((m) => t - m.born < m.life)
      markers.forEach((m) => {
        const age = (t - m.born) / m.life
        const y = height * m.series.yOffset + noisyY(m.x, m.series.seed, t * m.series.speed) * m.series.amp
        const pulse = Math.sin(age * Math.PI)
        ctx.beginPath()
        ctx.arc(m.x, y, 3 + pulse * 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${m.series.color}, ${pulse * 0.35})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(m.x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${m.series.color}, ${0.5 + pulse * 0.3})`
        ctx.fill()
      })

      t += 1
      if (!prefersReducedMotion) rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', resize)
      observer.disconnect()
      clearInterval(spawnInterval)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" aria-hidden="true" />
}
