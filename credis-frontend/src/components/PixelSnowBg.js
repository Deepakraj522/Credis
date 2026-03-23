import React, { useEffect, useRef } from 'react'
import './PixelSnowBg.css'

export default function PixelSnowBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const pixels = []
    const pixelSize = 8

    // Create pixels
    for (let i = 0; i < 150; i++) {
      pixels.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        size: Math.random() * 3 + 2
      })
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      pixels.forEach(pixel => {
        // Update position
        pixel.x += pixel.vx
        pixel.y += pixel.vy

        // Reset if out of bounds
        if (pixel.y > canvas.height) {
          pixel.y = -pixelSize
          pixel.x = Math.random() * canvas.width
        }

        if (pixel.x < 0) pixel.x = canvas.width
        if (pixel.x > canvas.width) pixel.x = 0

        // Draw pixel
        ctx.fillStyle = `rgba(108, 99, 255, ${pixel.opacity})`
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <canvas ref={canvasRef} className="pixel-snow-bg" />
}
