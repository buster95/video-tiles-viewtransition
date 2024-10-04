import { useEffect } from 'react'
import './App.scss'

export function App() {
  function OrderItems() {
    const grid = document.querySelector('.grid') as HTMLElement
    const items = Array.from(grid.children)
    items.sort((a, b) => Number(a.getAttribute('data-item')) - Number(b.getAttribute('data-item')))
    return items
  }

  function ShuffleItems() {
    const grid = document.querySelector('.grid') as HTMLElement
    const items = Array.from(grid.children)
    items.sort(() => Math.random() - 0.5)
    return items
  }

  const handleSuffle = () => {
    const items = ShuffleItems()
    const grid = document.querySelector('.grid') as HTMLElement
    document.startViewTransition(() => {
      grid.replaceChildren(...items)
    })
  }

  const handleOrder = () => {
    const items = OrderItems()
    const grid = document.querySelector('.grid') as HTMLElement
    document.startViewTransition(() => {
      grid.replaceChildren(...items)
    })
  }

  useEffect(() => {
    const videoElements = document.querySelectorAll<HTMLVideoElement>('.item video')
    const constraints = {
      video: {
        width: { ideal: 4096 },
        height: { ideal: 2160 }
      }
    }

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        videoElements.forEach((videoElement: HTMLVideoElement) => {
          videoElement.srcObject = stream
        })
      })
      .catch((error) => {
        console.error('Error accessing media devices.', error)
      })

    return () => {
      videoElements.forEach((videoElement: HTMLVideoElement) => {
        const stream = videoElement.srcObject as MediaStream
        const tracks = stream?.getTracks()
        tracks?.forEach((track) => {
          track.stop()
        })
      })
    }
  }, [])

  return (
    <>
      <div className="controls">
        <button type="button" onClick={handleOrder}>Order</button>
        <button type="button" onClick={handleSuffle}>Shuffle</button>
      </div>

      <div className="grid">
        {Array.from({ length: 16 }, (_, i) => (
          <div key={i} className={`item item${i}`} data-item={i} style={{ viewTransitionName: `item${i}` }}>
            <video className='output' autoPlay muted />
          </div>
        ))}
      </div>
    </>
  )
}
