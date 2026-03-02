export function Loader() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ background: '#000', zIndex: 50 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: '#f5a623', animationDuration: '1s' }}
          />
          <div
            className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
            style={{ borderTopColor: '#f5c842', animationDuration: '1.5s', animationDirection: 'reverse' }}
          />
        </div>
        <p
          className="text-2xl"
          style={{ fontFamily: 'var(--font-pacifico)', color: '#f5a623' }}
        >
          Carregando...
        </p>
      </div>
    </div>
  )
}
