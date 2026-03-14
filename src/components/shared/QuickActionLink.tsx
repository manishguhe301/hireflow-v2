import Link from "next/link"

const QuickActionLink = ({
  href,
  icon,
  title,
  description,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
}) => {
  return (
    <Link
      href={href}
      className="p-6 bg-card border border-border/60 rounded-2xl hover:border-primary/40 transition hover:shadow-lg group hover:-translate-y-[2px]"
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-info/10 flex items-center justify-center transition">
          {icon}
        </div>
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">
            {description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default QuickActionLink