import clsx from 'clsx'

const HighlightContainer = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={clsx(
        'relative rounded-2xl bg-[#ffffff]/5 p-4 ring-1 ring-white/20 backdrop-blur-sm',
        className,
      )}
    >
      <div className="absolute -top-px right-11 left-20 h-px bg-linear-to-r from-sky-300/0 via-sky-300/70 to-sky-300/0"></div>
      <div className="absolute right-20 -bottom-px left-11 h-px bg-linear-to-r from-blue-400/0 via-blue-400 to-blue-400/0"></div>
      <div className="overflow-hidden break-words">{children}</div>
    </div>
  )
}

export default HighlightContainer
