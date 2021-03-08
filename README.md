# Fluido Effects

## useRipple

```tsx
const { anchor } = useRipple()
// or
const { anchor } = useRipple({
  toCenter: true,
  disabled: false,
})

return <button ref={anchor}>BUTTON</button>
```

## useScrollDetector

```tsx
const [scroll] = useScrollDetector()
// or
const [scroll, ref] = useScrollDetector(true) // for a element scroll

console.log(scroll.value)
/*
{ toUp: false, toDown: false, toLeft: false, toRight: false }
*/

// if it's a container scroll
return <div ref={ref}>{...data}</div>
```

## useTheme

```tsx
const theme = useTheme() // a theme state
// or
const theme = useTheme(true) // for disabled local-storage persistence

console.log(theme.value)
/*
  '' | 'dark' | 'light'
*/

// HTML DOM
// if value it's 'dark'
<html dark-theme/>
// if value it's 'light'
<html light-theme/>
```
