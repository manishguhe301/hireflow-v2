import Link from 'next/link'
import React from 'react'

type Content = {
  srNo: number,
  title: string,
  desc: string
}

const AuthAsideSection = ({ title, highLightedText, desc, content }: {
  title: string
  highLightedText: string,
  desc: string,
  content: Content[]
}) => {
  return (
    <aside className="hidden lg:flex lg:col-span-2 flex-col justify-between px-20 py-16 border-r border-border/60 bg-muted/30 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full" />
      </div>
      <Link
        href="/"
        className="text-sm text-muted-foreground hover:text-foreground transition"
      >
        ← Back to Home
      </Link>

      <div>
        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          {title}
          <span className="block text-primary mt-2">{highLightedText}</span>
        </h1>

        <p className="mt-6 text-muted-foreground max-w-md">
          {desc}
        </p>

        <div className="mt-12 space-y-8">
          {content.map((item, i) => (
            <div key={item.title} className="flex gap-4">
              <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold px-4 ">
                {item.srNo}
              </div>
              <div>
                <h4 className="font-semibold">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} HireFlow<span className="text-primary">.</span>
      </p>
    </aside>
  )
}

export default AuthAsideSection