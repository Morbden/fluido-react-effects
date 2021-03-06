import { createState, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'
import { useEffect } from 'react'

type ThemeProps = 'light' | 'dark' | null

const ThemeState = createState<ThemeProps>(null)

const useTheme = (isSSR: boolean = false) => {
  const state = useState<ThemeProps>(ThemeState)
  if (!isSSR) {
    state.attach(Persistence('fl-style-theme-selected'))
  }

  useEffect(() => {
    if (!isSSR) {
      const html = document.documentElement
      switch (state.value) {
        case 'light':
          html.setAttribute('light-theme', '')
          html.removeAttribute('dark-theme')
          break
        case 'dark':
          html.setAttribute('dark-theme', '')
          html.removeAttribute('light-theme')
          break
        default:
          html.removeAttribute('dark-theme')
          html.removeAttribute('light-theme')
      }
    }
  }, [isSSR, state.value])

  return state
}

export default useTheme
