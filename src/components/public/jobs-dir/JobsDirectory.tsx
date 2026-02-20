'use client'
import { Briefcase, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { FormSelect } from '../../ui/FormSelect'
import { jobCategories } from '@/src/utils/utils'
import { Spinner } from '../../elements/Loader'
import Pagination from '../../ui/Pagination'
import JobCard from './JobCard'
import FilterSidebar from './FilterSidebar'
import { Button } from '../../ui/Button'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'

export type DirJobType = {
  id: string,
  title: string,
  category: string,
  company: {
    name: string,
    logo: string,
    website: string,
    id: string,
  },
  country: string,
  city: string,
  workMode: string,
  employmentType: string,
  applicationDeadline: string,
  experienceLevel: string,
  numberOfOpenings: string,
  slug: string,
  salaryMax: number,
  salaryMin: number,
  createdAt: string,
  updatedAt: string
}


type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

type Filters = {
  workModes: string[]
  employmentTypes: string[]
  experienceLevels: string[]
  salaryMin: number
  salaryMax: number
  datePosted: string
  sortBy: string
}

const JobsDirectory = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [isLoading, setIsLoading] = useState(true)
  const [jobs, setJobs] = useState<DirJobType[]>([])
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = session?.user?.id
  const pathName = usePathname()

  const [filters, setFilters] = useState<Filters>({
    workModes: [],
    employmentTypes: [],
    experienceLevels: [],
    salaryMin: 0,
    salaryMax: 10000000,
    datePosted: '',
    sortBy: 'recent',
  })


  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (location) params.set('country', location)
      if (filters.workModes.length) params.set('workModes', filters.workModes.join(','))
      if (filters.employmentTypes.length) params.set('employmentTypes', filters.employmentTypes.join(','))
      if (filters.experienceLevels.length) params.set('experienceLevels', filters.experienceLevels.join(','))
      if (filters.salaryMin > 0) params.set('salaryMin', filters.salaryMin.toString())
      if (filters.salaryMax < 10000000) params.set('salaryMax', filters.salaryMax.toString())
      if (filters.datePosted) params.set('datePosted', filters.datePosted)
      if (filters.sortBy) params.set('sortBy', filters.sortBy)

      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await fetch(
        `/api/jobs?${params.toString()}`
      )
      const data = await res.json()

      setJobs(data.jobs || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, category, location, page, filters])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (location) params.set('location', location)
    if (page > 1) params.set('page', page.toString())

    let basePath = ''
    if (session && session.user && session.user.role === 'JOB_SEEKER') {
      basePath = '/jobs'
    } else {
      basePath = '/explore/jobs'
    }

    const queryString = params.toString()
    const newUrl = queryString
      ? `${basePath}?${queryString}`
      : basePath

    if (newUrl !== `${pathName}?${searchParams.toString()}`) {
      router.push(newUrl, { scroll: false })
    }
  }, [search, category, location, page, session, pathName])

  useEffect(() => {
    const shouldDebounce = search.length > 0 || location.length > 0 || filters.workModes.length > 0 || filters.employmentTypes.length > 0 || filters.experienceLevels.length > 0 || filters.salaryMin > 0 || filters.salaryMax < 10000000 || filters.datePosted || filters.sortBy
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchJobs()
    }, delay)
    if (isMobileFilterOpen) setIsMobileFilterOpen(false)

    return () => clearTimeout(timer)
  }, [search, category, location, page, fetchJobs])

  const handleClearAllFilters = () => {
    setFilters({
      workModes: [],
      employmentTypes: [],
      experienceLevels: [],
      salaryMin: 0,
      salaryMax: 10000000,
      datePosted: '',
      sortBy: 'recent',
    })
    setSearch('')
    setCategory('')
    setLocation('')
    setPage(1)
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileFilterOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])


  useEffect(() => {
    if (isMobileFilterOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileFilterOpen])

  useEffect(() => {
    setPage(1)
  }, [filters])


  return (
    <div className={clsx(isLoggedIn
      ? 'space-y-6 ' : "mx-auto max-w-5xl px-4 py-10 space-y-10")}>
      {!isLoggedIn ?
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Explore Jobs</h1>
          <p className="text-muted-foreground text-lg">
            Find your next opportunity today
          </p>
        </div> : <div>
          <h1 className="text-3xl font-bold tracking-tight">Browse Jobs</h1>
          <p className="text-muted-foreground mt-1">
            Discover opportunities that match your skills and career goals
          </p>
        </div>
      }

      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
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
            type="text"
            placeholder="Location"
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

      {!isLoading && pagination ? (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{jobs.length}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> jobs
        </p>
      ) : <p className="text-sm text-muted-foreground ">Loading Results...</p>}

      <div className="relative flex gap-6">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={setFilters}
            onClearAll={handleClearAllFilters}
          />
        </div>

        {isMobileFilterOpen && (
          <div className='lg:hidden'>
            <div
              className="fixed inset-0 bg-black/40 z-40"
              onClick={() => setIsMobileFilterOpen(false)}
            />

            <div
              className={`fixed top-0 left-0 h-full w-full max-w-sm bg-background z-50 shadow-xl overflow-y-auto transform transition-transform duration-300 ${isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
              <div className="p-6 border-b border-border/40 flex justify-between items-center">
                <h3 className="font-semibold text-lg">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="text-sm text-muted-foreground"
                >
                  Close
                </button>
              </div>

              <div className="p-6">
                <FilterSidebar
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearAll={handleClearAllFilters}
                />
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 min-w-0">
          {isLoading && (
            <div className="flex justify-center py-24">
              <Spinner className="h-8 w-8" />
            </div>
          )}

          {!isLoading && jobs.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}

          {!isLoading && jobs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-center w-full">
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Briefcase className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-1">No jobs found</h3>
              <p className="text-sm text-muted-foreground mb-6 max-w-sm">
                Try adjusting your search or filters to find what you&apos;re looking for.
              </p>
              <button
                onClick={handleClearAllFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}

          {!isLoading && pagination && pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default JobsDirectory
