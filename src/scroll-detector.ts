import { createState, useState } from '@hookstate/core'
import { useViewportScroll } from 'framer-motion'
import { useEffect, useRef } from 'react'

interface ScrollDetectorProps {
  toUp: boolean
  toDown: boolean
  toLeft: boolean
  toRight: boolean
}

const ScrollDetectorState = createState<ScrollDetectorProps>({
  toUp: false,
  toDown: false,
  toLeft: false,
  toRight: false,
})

const useScrollDetector = () => {
  const scroll = useViewportScroll()
  const posRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    console.log('load')
    const returns = [
      scroll.scrollX.onChange((x) => {
        const toLeft = x < posRef.current.x
        const toRight = x > posRef.current.x
        posRef.current.x = x

        ScrollDetectorState.merge({ toLeft, toRight })
      }),
      scroll.scrollY.onChange((y) => {
        const toUp = y < posRef.current.y
        const toDown = y > posRef.current.y
        posRef.current.y = y

        ScrollDetectorState.merge({ toUp, toDown })
      }),
    ]

    return () => {
      returns.forEach((fn) => fn())
    }
  }, [scroll])

  return useState<ScrollDetectorProps>(ScrollDetectorState)
}

export default useScrollDetector
