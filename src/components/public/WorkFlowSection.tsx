import { Step } from "./HowItWorks"

const WorkflowSection = ({ title, subtitle, steps }: {
  title: string
  subtitle?: string
  steps: Step[]
}) => {
  return (
    <section className="border-b border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ icon, title, desc }: Step, i: number) => (
            <div
              key={title}
              className="rounded-2xl border border-border/60 bg-card p-8 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-6 flex justify-center">
                <div className="relative inline-flex">
                  <div className="absolute inset-0 rounded-xl bg-primary/20 blur-xl" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 ring-1 ring-primary/20">
                    {icon}
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-primary/70 tracking-widest">
                STEP {i + 1}
              </span>
              <h3 className="font-semibold mt-2 mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WorkflowSection