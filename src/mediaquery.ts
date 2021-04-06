import { useEffect, useState } from 'react'

const isBrowser = () => {
  try {
    return !!window
  } catch (e) {
    return false
  }
}

const useMediaQuery = (query: string) => {
  const [val, setVal] = useState<boolean>(false)
  const browser = isBrowser()

  useEffect(() => {
    let media: MediaQueryList

    const handler = (ev: MediaQueryListEvent) => {
      setVal(ev.matches)
    }

    if (browser) {
      media = window.matchMedia(query)
      if (media.matches !== val) {
        setVal(media.matches)
      }

      media.addEventListener('change', handler)
    }
    return () => {
      if (media) {
        media.removeEventListener('change', handler)
        media = null
      }
    }
  }, [browser, query])

  return val
}

export default useMediaQuery
