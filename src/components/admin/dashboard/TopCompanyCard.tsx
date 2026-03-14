
const TopCompanyCard = ({ company, index }: {
  company: { name: string; jobs: number },
  index: number
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
          {index + 1}
        </div>
        <p className="font-medium">{company.name}</p>
      </div>
      <span className="text-muted-foreground">{company.jobs} jobs</span>
    </div>
  )
}

export default TopCompanyCard