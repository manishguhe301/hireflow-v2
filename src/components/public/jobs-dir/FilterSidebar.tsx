'use client'

import { workModes, employmentTypes, experienceLevels } from '@/src/utils/constants'

type Filters = {
  workModes: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  salaryMin: number
  salaryMax: number
  datePosted: string
  sortBy: string
}

type FilterSidebarProps = {
  filters: Filters
  onFilterChange: (filters: Filters) => void
  onClearAll: () => void
}

export default function FilterSidebar({ filters, onFilterChange, onClearAll }: FilterSidebarProps) {
  const toggleArrayFilter = (key: keyof Pick<Filters, 'workModes' | 'employmentTypes' | 'experienceLevels'>, value: string) => {
    const current = filters[key]
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]
    onFilterChange({ ...filters, [key]: updated })
  }

  return (
    <aside className="w-60 shrink-0 space-y-6 max-lg:w-full">
      <div className="rounded-2xl border border-border/40 bg-card p-6 sticky top-24">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Filters</h3>
          <button
            onClick={onClearAll}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Work Mode</h4>
            {workModes.map((mode) => (
              <label key={mode.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.workModes.includes(mode.value)}
                  onChange={() => toggleArrayFilter('workModes', mode.value)}
                  className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30 text-white!"
                />
                <span className="text-sm">{mode.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-6">
            <h4 className="font-medium text-sm">Employment Type</h4>
            {employmentTypes.map((type) => (
              <label key={type.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.employmentTypes.includes(type.value)}
                  onChange={() => toggleArrayFilter('employmentTypes', type.value)}
                  className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30 text-white!" />
                <span className="text-sm">{type.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-6">
            <h4 className="font-medium text-sm">Experience Level</h4>
            {experienceLevels.map((level) => (
              <label key={level.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.experienceLevels.includes(level.value)}
                  onChange={() => toggleArrayFilter('experienceLevels', level.value)}
                  className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30 text-white!" />
                <span className="text-sm">{level.label}</span>
              </label>
            ))}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-6">
            <h4 className="font-medium text-sm">Salary Range (₹/year)</h4>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Min Salary</label>
                <input
                  type="number"
                  value={filters.salaryMin}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    onFilterChange({
                      ...filters,
                      salaryMin: Number.isNaN(value) ? 0 : value
                    })
                  }}
                  placeholder="Min"
                  aria-label="Min"
                  min={0}
                  step={10000}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Max Salary</label>
                <input
                  type="number"
                  value={filters.salaryMax}
                  onChange={(e) => {
                    const value = Number(e.target.value)
                    onFilterChange({
                      ...filters,
                      salaryMax: Number.isNaN(value) ? 0 : value
                    })
                  }}
                  step={10000}
                  placeholder="Max"
                  max={10000000}
                  min={0}
                  aria-label="Max"
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm outline-none focus:border-primary/40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 border-t border-border/40 pt-6">
            <h4 className="font-medium text-sm">Date Posted</h4>
            {[
              { label: 'Last 24 hours', value: '24h' },
              { label: 'Last 7 days', value: 'week' },
              { label: 'Last 30 days', value: 'month' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="datePosted"
                  checked={filters.datePosted === option.value}
                  onChange={() => onFilterChange({ ...filters, datePosted: option.value })}
                  className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30 text-white!" />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
            {filters.datePosted && (
              <button
                onClick={() => onFilterChange({ ...filters, datePosted: '' })}
                className="text-xs text-primary hover:underline"
              >
                Clear date filter
              </button>
            )}
          </div>

          <div className="space-y-3 border-t border-border/40 pt-6">
            <h4 className="font-medium text-sm">Sort By</h4>
            {[
              { label: 'Most Recent', value: 'recent' },
              { label: 'Salary: High to Low', value: 'salary_high' },
              { label: 'Salary: Low to High', value: 'salary_low' },
            ].map((option) => (
              <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sortBy"
                  checked={filters.sortBy === option.value}
                  onChange={() => onFilterChange({ ...filters, sortBy: option.value })}
                  className="h-4 w-4 rounded border-border/40 accent-primary focus:ring-2 focus:ring-primary/30 text-white! " />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}