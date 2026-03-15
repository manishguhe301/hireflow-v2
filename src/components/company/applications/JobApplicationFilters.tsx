import React, { Dispatch, SetStateAction } from 'react'
import { FormSelect } from '../../ui/FormSelect'
import { APPLICATION_TABS_WITH_SORT } from '@/src/utils/constants'
import { ApplicationStatus } from '@prisma/client'
import { RefreshCw, Search } from 'lucide-react'
import { Button } from '../../ui/Button'
import clsx from 'clsx'
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'

interface JobApplicationFiltersProps {
  isLoading: boolean,
  setPage: Dispatch<SetStateAction<number>>
  setSortBy: Dispatch<SetStateAction<string>>
  setActiveTab: Dispatch<SetStateAction<"ALL" | ApplicationStatus>>
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  isRefreshing: boolean
  setIsRefreshing: Dispatch<SetStateAction<boolean>>
  refetch: (options?: RefetchOptions) =>
    // eslint-disable-next-line
    Promise<QueryObserverResult<any, Error>>
  applicationsLength: number
  paginationTotal: number
}

const JobApplicationFilters = ({
  isLoading,
  setPage,
  setSortBy,
  setActiveTab,
  search,
  setSearch,
  isRefreshing,
  setIsRefreshing,
  refetch,
  applicationsLength,
  paginationTotal
}: JobApplicationFiltersProps) => {
  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-border/60 bg-card rounded-2xl p-4">
        <FormSelect
          options={APPLICATION_TABS_WITH_SORT}
          disabled={isLoading}
          placeholder='Filters'
          onChange={(value) => {
            setPage(1)

            if (value === 'name' || value === 'recent' || value === 'oldest') {
              setSortBy(value)
              setActiveTab('ALL')
              return
            }

            if (value === 'ALL') {
              setActiveTab('ALL')
              setSortBy('')
              return
            }

            setActiveTab(value as ApplicationStatus)
            setSortBy('')
          }}
          className='py-2! w-full md:w-80'
        />
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="w-full md:w-64 rounded-xl border border-border/60 bg-background pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/40"
            aria-label="Search applicants"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs"
            >
              Clear
            </button>
          )}
        </div>
        <Button
          className='flex items-center gap-2'
          disabled={isRefreshing}
          onClick={() => {
            if (isRefreshing) return;
            setPage(1)
            setActiveTab('ALL')
            setSortBy('')
            setSearch('')

            setIsRefreshing(true);
            refetch();

            setTimeout(() => setIsRefreshing(false), 1000);
          }}>
          <RefreshCw
            size={16}
            className={clsx(
              'transition',
              isRefreshing && 'animate-spin opacity-50 cursor-not-allowed'
            )}
          />
          Refresh

        </Button>
      </div>
      <div className="flex items-center  gap-4 mt-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{applicationsLength} </span>
          of <span className="font-semibold text-foreground">{paginationTotal}</span> applicants
        </p>
      </div>
    </div>
  )
}

export default JobApplicationFilters