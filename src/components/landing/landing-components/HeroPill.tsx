import React from 'react'

const HeroPill = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="inline-block mb-6 rounded-full border border-border/60 bg-muted/50 px-4 py-1 text-xs tracking-widest text-muted-foreground">{children}</span>
  )
}

export default HeroPill