import { createState, useState } from '@hookstate/core'
import { Persistence } from '@hookstate/persistence'
import { useEffect } from 'react'

type ThemeProps = 'light' | 'dark' | null

const ThemeState = createState<ThemeProps>(null)

const useTheme = (disabledLocalStorage: boolean = false) => {
  const state = useState<ThemeProps>(ThemeState)
  if (!disabledLocalStorage) {
    state.attach(Persistence('fl-style-theme-selected'))
  }

  useEffect(() => {
    if (!disabledLocalStorage) {
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
  }, [disabledLocalStorage, state.value])

  return state
}

export default useTheme
