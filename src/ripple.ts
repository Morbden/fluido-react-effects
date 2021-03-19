import equal from 'deep-equal'
import React, { Component, useEffect, useRef, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import styled from 'styled-components'
import { uid } from 'uid'

type RippleComponentType = string | React.Component | React.FunctionComponent

interface RippleBoxType extends HTMLDivElement {
  __pos?: { x: number; y: number }
  __ripple?: HTMLElement
  __timerId?: any
  __rippleSize?: number
  __swingGrow?: boolean
}

export interface RippleProps {
  ripple?: RippleComponentType
  toCenter?: boolean
  disabled?: boolean
}

interface ProcessOptionType {
  (arg?: RippleComponentType | RippleProps): RippleProps
}

type EaseTransitionType =
  | 'ease-in-out'
  | 'ease-out'
  | 'ease-in'
  | 'ease'
  | 'linear'

const transitionEase = (
  ease: EaseTransitionType = 'ease-in-out',
  timeMilliseconds: number = 250,
) =>
  `transform ${timeMilliseconds}ms ${ease}, opacity ${timeMilliseconds}ms 200ms ${ease} `

const DefaultRipple = styled.div`
  position: absolute;
  background-color: currentColor;
  border-radius: 99999999px;
  width: 1rem;
  height: 1rem;
`

const RippleBox = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`

const createRippleBox = () => {
  const div = document.createElement('div')
  const boxString = React.createElement(RippleBox as any, null, null)
  div.innerHTML = ReactDOMServer.renderToString(boxString) as string
  const box = div.children[0] as RippleBoxType
  box.__pos = { x: 0, y: 0 }
  box.classList.add(`ripple-box-${uid(6)}`)
  return box
}

const appendRipple = (ripple: RippleComponentType, box: RippleBoxType) => {
  const element = React.createElement(ripple as any, null, null)
  box.innerHTML = ReactDOMServer.renderToString(element) as string
  box.__ripple = box.children[0] as HTMLElement

  const { height, width } = box.getBoundingClientRect()

  box.__ripple.style.position = 'absolute'
  box.__ripple.style.width = '1rem'
  box.__ripple.style.height = '1rem'
  box.__ripple.style.top = '-0.5rem'
  box.__ripple.style.left = '-0.5rem'
  box.__ripple.style.right = 'none'
  box.__ripple.style.bottom = 'none'
  box.__ripple.style.transformOrigin = '50% 50%'
  box.__ripple.style.transform = normalizeTransform(width / 2, height / 2)
  box.__ripple.style.opacity = '0'
  box.__ripple.style.pointerEvents = 'none'
}

const processOptions: ProcessOptionType = (arg) => {
  const opt: RippleProps = {
    ripple: DefaultRipple,
    toCenter: false,
  }
  if (['string', 'function'].includes(typeof arg) || arg instanceof Component) {
    opt.ripple = arg as RippleComponentType
  } else if (typeof arg === 'object') {
    Object.assign(opt, arg)
  }

  return opt
}

const normalizePos = (x: number, y: number, isClean: boolean) => ({
  x: isClean ? 0 : x || 0,
  y: isClean ? 0 : y || 0,
})

const normalizeTransform = (x: number = 0, y: number = 0, scale: number = 0) =>
  `translate(${x}px, ${y}px) scale(${scale})`

const clearAnimation = (box: RippleBoxType) => {
  box.__ripple.style.transition = 'none'
  box.__ripple.style.transform = normalizeTransform()
  box.__ripple.style.opacity = '0.24'
}

const startRipple = (
  box: RippleBoxType,
  opt: { x?: number; y?: number } & RippleProps,
) => {
  const state = box.getAttribute('data-state')
  if (state === 'start') return
  clearAnimation(box)

  const { x, y } = normalizePos(opt.x, opt.y, opt.toCenter)

  const { height, width, top, left } = box.getBoundingClientRect()

  const cx = x - left
  const cy = y - top
  let rippleSize = Math.min(height, width, 100)

  const positionLeft = x ? cx : width / 2
  const positionTop = y ? cy : height / 2

  box.__rippleSize = rippleSize / 2
  box.__pos = { x: positionLeft, y: positionTop }

  box.__ripple.style.transform = normalizeTransform(box.__pos.x, box.__pos.y)
  setTimeout(() => {
    box.__ripple.style.transition = transitionEase('ease-out', 4000)
    box.__ripple.style.transform = normalizeTransform(
      box.__pos.x,
      box.__pos.y,
      box.__rippleSize,
    )
    box.__ripple.style.opacity = '0.24'
  }, 50)

  box.setAttribute('data-state', 'start')
}

const swingRipple = (box: RippleBoxType) => {
  const state = box.getAttribute('data-state')
  if (state === 'start' || state === 'swing') return
  clearAnimation(box)

  const { height, width } = box.getBoundingClientRect()

  let rippleSize = Math.max(height, width)

  const positionLeft = width / 2
  const positionTop = height / 2

  box.__rippleSize = rippleSize * 0.25
  box.__pos = { x: positionLeft, y: positionTop }

  box.__ripple.style.transform = normalizeTransform(box.__pos.x, box.__pos.y)

  const swingCall = () => {
    const state = box.getAttribute('data-state')
    if (state !== 'swing') {
      if (box.__timerId) {
        clearTimeout(box.__timerId)
        box.__timerId = null
      }
      return
    }

    box.__ripple.style.transition = transitionEase('ease', 1000)
    box.__ripple.style.transform = normalizeTransform(
      box.__pos.x,
      box.__pos.y,
      box.__rippleSize * (box.__swingGrow ? 0.2 : 0.16),
    )
    box.__ripple.style.opacity = '0.24'

    box.__swingGrow = !box.__swingGrow
    box.__timerId = setTimeout(swingCall, 1000)
  }
  setTimeout(swingCall, 50)

  box.setAttribute('data-state', 'swing')
}

const releaseRipple = (box: RippleBoxType) => {
  const state = box.getAttribute('data-state')
  if (state === 'release') return
  setTimeout(() => {
    box.__swingGrow = true
    box.__ripple.style.transition = transitionEase('ease-out')
    box.__ripple.style.transform = normalizeTransform(
      box.__pos.x,
      box.__pos.y,
      state === 'start' ? box.__rippleSize : 0,
    )
    box.__ripple.style.opacity = '0'
  }, 50)

  box.setAttribute('data-state', 'release')
}
const useRipple = (arg?: RippleProps) => {
  const anchorRef = useRef(null)
  const boxRef = useRef<RippleBoxType>(null)
  const [argRef, setArg] = useState<RippleProps>(null)

  useEffect(() => {
    if (!equal(arg, argRef)) setArg(arg || {})
    if (argRef && argRef.disabled) return
    const anchor = anchorRef.current as HTMLElement
    if (!anchor) return
    if (!boxRef.current) {
      boxRef.current = createRippleBox()
    }
    anchor.style.position = 'relative'
    anchor.appendChild(boxRef.current)

    const opt: RippleProps = processOptions(argRef)
    appendRipple(opt.ripple, boxRef.current)

    const onRipple = (ev: MouseEvent) => {
      startRipple(boxRef.current, {
        ...opt,
        x: ev.clientX,
        y: ev.clientY,
      })
    }
    const onKeyboardDown = (ev: KeyboardEvent) => {
      if (ev.code === 'Enter' || ev.code === 'Space') {
        startRipple(boxRef.current, opt)
      }
    }
    const onKeyboardUp = (ev: KeyboardEvent) => {
      if (ev.code === 'Enter' || ev.code === 'Space') {
        releaseRipple(boxRef.current)
      }
    }
    const onFocus = () => {
      swingRipple(boxRef.current)
    }
    const onReleaseRipple = () => {
      releaseRipple(boxRef.current)
    }

    anchor.addEventListener('mousedown', onRipple)
    anchor.addEventListener('keydown', onKeyboardDown)
    anchor.addEventListener('focus', onFocus)
    anchor.addEventListener('keyup', onKeyboardUp)
    anchor.addEventListener('blur', onReleaseRipple)
    window.addEventListener('mouseup', onReleaseRipple, true)
    return () => {
      anchor.removeChild(boxRef.current)
      anchor.removeEventListener('mousedown', onRipple)
      anchor.removeEventListener('keydown', onKeyboardDown)
      anchor.removeEventListener('focus', onFocus)
      anchor.removeEventListener('keyup', onKeyboardUp)
      anchor.removeEventListener('blur', onReleaseRipple)
      window.removeEventListener('mouseup', onReleaseRipple, true)
    }
  }, [arg && arg.disabled, anchorRef, equal(arg, argRef)])

  return {
    anchor: anchorRef,
  }
}

export default useRipple
