import React from 'react'

const PageTop = ({ desc, children }: {
  desc: string,
  children: React.ReactNode
}) => {
  return (
    <section className="relative overflow-hidden isolate">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 top-[-120px] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-primary/15 blur-[160px]" />
      </div>
      <div className="mx-auto max-w-7xl px-6 py-28 text-center space-y-6">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          {children}
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {desc}
        </p>
      </div>
    </section>
  )
}

export default PageTop