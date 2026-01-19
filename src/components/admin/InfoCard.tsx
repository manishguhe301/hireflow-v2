const InfoCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div className="bg-card border border-border/40 rounded-2xl p-6 space-y-4">
    <h3 className="font-semibold">{title}</h3>
    {children}
  </div>
)

export default InfoCard