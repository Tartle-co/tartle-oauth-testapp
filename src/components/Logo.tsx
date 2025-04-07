import { useId } from 'react'

export function Logo(props: React.ComponentPropsWithoutRef<'svg'>) {
  let id = useId()

  return (
    <svg viewBox="0 0 35 40" fill="none" {...props}>
      <path
        d="M17.9966 39.1338L34.3247 29.6706L34.2922 9.87187L17.1292 0L0 9.9281L0.032495 29.7268L13.0075 37.1904L16.8555 39.4037V20.5498H25.8913V16.4419H4.58537V20.5498H13.0075V32.865L3.77803 27.556L3.75303 12.0864L17.1367 4.33042L30.5467 12.0427L30.5717 27.5122L17.9966 34.8008V39.1338Z"
        fill="currentColor"
      />
      z
    </svg>
  )
}
