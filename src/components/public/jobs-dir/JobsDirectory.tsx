'use client'
import { Briefcase, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'
import { FormSelect } from '../../ui/FormSelect'
import { jobCategories } from '@/src/utils/utils'
import { Spinner } from '../../elements/Loader'
import Pagination from '../../ui/Pagination'
import JobCard from './JobCard'

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

  const fetchJobs = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (category) params.set('category', category)
      if (location) params.set('country', location)
      params.set('page', page.toString())
      // params.set('limit', '12')
      params.set('limit', '12')

      const res = await fetch(
        `/api/jobs?${params.toString()}`
      )
      const data = await res.json()

      setJobs(data.jobs || [])
      setPagination(data.pagination)
      console.log(data);
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, category, location, page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    if (location) params.set('location', location)
    if (page > 1) params.set('page', page.toString())

    router.push(`/explore/jobs?${params.toString()}`, { scroll: false })
  }, [search, category, location, page, router])

  useEffect(() => {
    const shouldDebounce = search.length > 0 || location.length > 0
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchJobs()
    }, delay)

    return () => clearTimeout(timer)
  }, [search, category, location, page, fetchJobs])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Explore Jobs</h1>
        <p className="text-muted-foreground text-lg">
          Find your next opportunity today
        </p>
      </div>
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
      </div>

      {!isLoading && pagination && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{jobs.length}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> jobs
        </p>
      )}


      {isLoading && (
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && jobs.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {!isLoading && jobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-1">No jobs found</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Try adjusting your search or filters to find what you&apos;re looking for.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setCategory('')
              setLocation('')
              setPage(1)
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {!isLoading && pagination && (
        <Pagination
          page={page}
          totalPages={pagination.totalPages}
          onPageChange={(p) => setPage(p)}
        />
      )}
    </div>
  )
}

export default JobsDirectory