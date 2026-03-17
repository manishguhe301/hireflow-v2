import { Search } from 'lucide-react'
import React, { Dispatch, SetStateAction } from 'react'
import { FormSelect } from '../../ui/FormSelect'
import { Button } from '../../ui/Button'
import { jobCategories } from '@/src/utils/constants'

const SearchSection = ({
  search,
  setSearch,
  setPage,
  setCategory,
  location,
  setLocation,
  setIsMobileFilterOpen
}: {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  setPage: Dispatch<SetStateAction<number>>
  setCategory: Dispatch<SetStateAction<string>>
  location: string
  setLocation: Dispatch<SetStateAction<string>>
  setIsMobileFilterOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <div className="rounded-2xl border border-border/40 bg-card p-6 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            aria-label="Search jobs by title, skills, company…"
            placeholder="Search jobs by title, skills, company…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-border/60 bg-background pl-10 pr-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <FormSelect
          label=""
          placeholder="Job Categories"
          options={[
            { label: 'All Categories', value: '' },
            ...jobCategories,
          ]}
          onChange={(value) => {
            setCategory(value)
            setPage(1)
          }}
        />

        <input
          aria-label="Location"
          type="text"
          placeholder="Search by city or country..."
          value={location}
          onChange={(e) => {
            setLocation(e.target.value)
            setPage(1)
          }}
          className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none transition focus:border-primary/40 focus:ring-1 focus:ring-primary/30"
        />
      </div>
      <div className="lg:hidden flex justify-end py-4">
        <Button
          onClick={() => setIsMobileFilterOpen(true)}
          className="flex items-center gap-2 rounded-xl border border-border/40 bg-card px-4 py-2 text-sm"
          variant="outline"
        >
          Filters
        </Button>
      </div>
    </div>
  )
}

export default SearchSection