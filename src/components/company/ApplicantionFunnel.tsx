import { AnalyticsData } from "@/src/types"
import clsx from "clsx"

const ApplicantionFunnel = ({ analytics }: { analytics: AnalyticsData }) => {
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Applicant Funnel</h2>
      <div className="bg-card border border-border/60 rounded-2xl p-6">
        <div className="space-y-3">
          {analytics.funnel.map((stage) => (
            <div key={stage.stage} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{stage.stage}</span>
                <span className="text-muted-foreground">
                  {stage.count} ({stage.percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className={clsx("bg-primary h-3 rounded-full transition-all", stage.stage === "Rejected" && "bg-red-500")}
                  style={{ width: `${stage.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ApplicantionFunnel