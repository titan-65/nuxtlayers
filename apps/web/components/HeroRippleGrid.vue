<script setup lang="ts">
/**
 * HeroRippleGrid.vue
 * A canvas-based grid background with mouse ripple effects.
 */

const props = defineProps({
  gridColor: { type: String, default: '#333' },
  rippleIntensity: { type: Number, default: 0.1 },
  gridSize: { type: Number, default: 40 }, // cell size
  gridThickness: { type: Number, default: 1 }, // stroke width
  opacity: { type: Number, default: 0.5 },
  vignetteStrength: { type: Number, default: 1.0 }
})

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)

let ctx: CanvasRenderingContext2D | null = null
let animationId: number
let mouseX = 0
let mouseY = 0
let time = 0

// Track ripple positions
const ripples: { x: number; y: number; age: number; strength: number }[] = []

const handleMouseMove = (e: MouseEvent) => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()
  mouseX = e.clientX - rect.left
  mouseY = e.clientY - rect.top
  
  // Add new ripple on movement periodically or based on distance
  if (Math.random() > 0.8) {
     ripples.push({
         x: mouseX,
         y: mouseY,
         age: 0,
         strength: props.rippleIntensity
     })
  }
}

const resizeCanvas = () => {
    if (!canvasRef.value || !containerRef.value) return
    const rect = containerRef.value.getBoundingClientRect()
    canvasRef.value.width = rect.width
    canvasRef.value.height = rect.height
}

const draw = () => {
    if (!ctx || !canvasRef.value) return
    
    const width = canvasRef.value.width
    const height = canvasRef.value.height
    
    // Clear
    ctx.clearRect(0, 0, width, height)
    
    // Update time
    time += 0.05
    
    // Update ripples
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].age += 1
        if (ripples[i].age > 100) {
            ripples.splice(i, 1)
        }
    }

    ctx.strokeStyle = props.gridColor
    ctx.lineWidth = props.gridThickness
    ctx.globalAlpha = props.opacity
    
    const cellSize = props.gridSize
    
    ctx.beginPath()
    
    // Draw vertical lines with distortion
    for (let x = 0; x <= width; x += cellSize) {
        for (let y = 0; y <= height; y += 10) { // Segmented lines for curve support
             let offsetX = 0
             // Calculate ripple influence
             ripples.forEach(r => {
                 const dx = x - r.x
                 const dy = y - r.y
                 const dist = Math.sqrt(dx*dx + dy*dy)
                 if (dist < 200) {
                     const wave = Math.sin(dist * 0.05 - time) * Math.exp(-dist * 0.01) * Math.exp(-r.age * 0.05)
                     offsetX += wave * r.strength * 50
                 }
             })

             if (y === 0) ctx.moveTo(x + offsetX, y)
             else ctx.lineTo(x + offsetX, y)
        }
    }
    
    // Draw horizontal lines with distortion
    for (let y = 0; y <= height; y += cellSize) {
        for (let x = 0; x <= width; x += 10) {
             let offsetY = 0
             ripples.forEach(r => {
                 const dx = x - r.x
                 const dy = y - r.y
                 const dist = Math.sqrt(dx*dx + dy*dy)
                 if (dist < 200) {
                     const wave = Math.sin(dist * 0.05 - time) * Math.exp(-dist * 0.01) * Math.exp(-r.age * 0.05)
                     offsetY += wave * r.strength * 50
                 }
             })

             if (x === 0) ctx.moveTo(x, y + offsetY)
             else ctx.lineTo(x, y + offsetY)
        }
    }
    
    ctx.stroke()
    
    // Vignette
    if (props.vignetteStrength > 0) {
        const gradient = ctx.createRadialGradient(width/2, height/2, width/4, width/2, height/2, width)
        gradient.addColorStop(0, `rgba(0,0,0,0)`)
        gradient.addColorStop(1, `rgba(0,0,0,${props.vignetteStrength * 0.5})`)
        ctx.globalCompositeOperation = 'destination-in'
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, width, height)
        ctx.globalCompositeOperation = 'source-over'
    }

    animationId = requestAnimationFrame(draw)
}

onMounted(() => {
    if (!canvasRef.value) return
    ctx = canvasRef.value.getContext('2d')
    
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    
    draw()
})

onUnmounted(() => {
    window.removeEventListener('resize', resizeCanvas)
    cancelAnimationFrame(animationId)
})
</script>

<template>
  <div 
    ref="containerRef" 
    class="w-full h-full overflow-hidden pointer-events-auto"
    @mousemove="handleMouseMove"
  >
    <canvas ref="canvasRef" class="block w-full h-full"></canvas>
  </div>
</template>
