import clsx from "clsx"

const ProfileSection = ({ title, children, className }: { title: string, children: React.ReactNode, className?: string }) => (
  <div className={clsx("rounded-2xl border border-border/40 bg-card p-6", className!)}>
    <h2 className="text-lg font-semibold mb-6">{title}</h2>
    {children}
  </div>
)

const Pill = ({ text }: { text: string }) => {
  return <span
    className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
  >
    {text}
  </span>
}

const SubHeader = ({ text }: { text: string }) => <p className="font-medium text-foreground mb-1">{text}</p>


export {
  ProfileSection,
  Pill,
  SubHeader
}