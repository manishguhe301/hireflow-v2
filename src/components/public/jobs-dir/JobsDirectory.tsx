'use client'
import { Briefcase, Search } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { FormSelect } from '../../ui/FormSelect'
import { jobCategories } from '@/src/utils/constants'
import Pagination from '../../ui/Pagination'
import JobCard from './JobCard'
import FilterSidebar from './FilterSidebar'
import { Button } from '../../ui/Button'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { AppSdk } from '@/src/utils/AppSdk'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import useDebounce from '@/src/store/hooks/useDebounce'
import JobsDirectorySkeleton from '../../skeletons/JobsDirectorySkeleton'
import JobCardSkeleton from '../../skeletons/JobCardSkeleton'
import { DirJobType, Filters, PaginationType } from '@/src/types'
import SearchSection from './SearchSection'

const JobsDirectory = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const { data: session } = useSession()
  const isLoggedIn = session?.user?.id
  const pathName = usePathname()

  const [filters, setFilters] = useState<Filters>({
    workModes: [],
    employmentTypes: [],
    experienceLevels: [],
    salaryMin: 0,
    salaryMax: 150,
    datePosted: '',
    sortBy: 'recent',
  })
  const queryClient = useQueryClient()
  const debouncedSearch = useDebounce(search, 500)
  const debouncedLocation = useDebounce(location, 500)
  const debouncedCategory = useDebounce(category, 500)
  const debouncedFilters = useDebounce(filters, 500)

  const queryParams = useMemo(() => {
    const params = new URLSearchParams()

    if (debouncedSearch) params.set('search', debouncedSearch)
    if (debouncedCategory) params.set('category', debouncedCategory)
    if (debouncedLocation) params.set('country', debouncedLocation)

    if (debouncedFilters.workModes.length)
      params.set('workModes', debouncedFilters.workModes.join(','))

    if (debouncedFilters.employmentTypes.length)
      params.set('employmentTypes', debouncedFilters.employmentTypes.join(','))

    if (debouncedFilters.experienceLevels.length)
      params.set('experienceLevels', debouncedFilters.experienceLevels.join(','))

    if (debouncedFilters.salaryMin > 0)
      params.set('salaryMin', debouncedFilters.salaryMin.toString())

    if (debouncedFilters.salaryMax < 150)
      params.set('salaryMax', debouncedFilters.salaryMax.toString())

    if (debouncedFilters.datePosted)
      params.set('datePosted', debouncedFilters.datePosted)

    if (debouncedFilters.sortBy)
      params.set('sortBy', debouncedFilters.sortBy)

    params.set('page', page.toString())
    params.set('limit', '12')

    return params.toString()
  }, [debouncedSearch, debouncedCategory, debouncedLocation, debouncedFilters, page])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobs', queryParams, session?.user?.id ?? 'public'],
    queryFn: async ({ signal }) => {
      const res = await fetch(`/api/jobs?${queryParams}`, { signal })
      if (!res.ok) throw new Error('Failed to fetch jobs')
      return res.json()
    },
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false
  })

  const jobs: DirJobType[] = data?.jobs ?? []
  const pagination: PaginationType | null = data?.pagination ?? null
  const isFiltersSelected = search || category || location || filters.workModes.length || filters.employmentTypes.length || filters.experienceLevels.length || filters.salaryMin > 0 || filters.salaryMax < 150 || filters.datePosted || filters.sortBy

  useEffect(() => {
    if (!pagination || page >= pagination.totalPages) return
    const nextPageParams = queryParams.replace(`page=${page}`, `page=${page + 1}`)
    queryClient.prefetchQuery({
      queryKey: ['jobs', nextPageParams],
      queryFn: async () => {
        const res = await fetch(`/api/jobs?${nextPageParams}`)
        return res.json()
      }
    })
  }, [pagination, page, queryParams, queryClient])

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

    const currentURL = `${pathName}?${searchParams.toString()}`

    if (newUrl !== currentURL) {
      router.replace(newUrl, { scroll: false })
    }
  }, [search, category, location, page, session, pathName])

  useEffect(() => {
    // eslint-disable-next-line
    if (page !== 1) setPage(1)
  }, [filters])

  const saveJobMutation = useMutation({
    mutationFn: async ({ jobId, currentlySaved }: { jobId: string, currentlySaved: boolean }) => {
      if (currentlySaved) {
        return AppSdk.deleteData(`/api/jobs/saved?jobId=${jobId}`, null)
      } else {
        return AppSdk.postData(`/api/jobs/saved`, { jobId })
      }
    },
    onMutate: async ({ jobId, currentlySaved }) => {
      await queryClient.cancelQueries({ queryKey: ['jobs'] })

      const previousData = queryClient.getQueryData(['jobs', queryParams, session?.user?.id ?? 'public'])

      queryClient.setQueryData(
        ['jobs', queryParams, session?.user?.id ?? 'public'],
        //eslint-disable-next-line
        (old: any) => {
          if (!old) return old

          return {
            ...old,
            jobs: old.jobs.map((job: DirJobType) =>
              job.id === jobId
                ? { ...job, isSaved: !currentlySaved }
                : job
            )
          }
        }
      )

      return { previousData }
    },
    onSuccess: (_data, variables) => {
      if (variables.currentlySaved) {
        toast.success('Job removed from saved')
      } else {
        toast.success('Job saved successfully')
      }

      // queryClient.invalidateQueries({ queryKey: ['jobs'] })
      // queryClient.invalidateQueries({ queryKey: ['saved-jobs'] })
    },
    onError: (_err, _vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ['jobs', queryParams, session?.user?.id ?? 'public'],
          context.previousData
        )
      }

      toast.error('Failed to save job')
    },
  })

  const handleSaveToggle = (jobId: string, currentlySaved: boolean) => {
    saveJobMutation.mutate({ jobId, currentlySaved })
  }

  const handleClearAllFilters = () => {
    setFilters({
      workModes: [],
      employmentTypes: [],
      experienceLevels: [],
      salaryMin: 0,
      salaryMax: 150,
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
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
    }
  }, [isMobileFilterOpen])


  if (isLoading) {
    return <JobsDirectorySkeleton />
  }

  const start = (page - 1) * (pagination?.limit ?? 0) + 1;
  const end = Math.min(page * (pagination?.limit ?? 0), pagination?.total ?? 0);

  return (
    <div className={clsx(isLoggedIn
      ? 'space-y-6 ' : "mx-auto max-w-7xl px-4 py-10 space-y-10")}>
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

      <SearchSection
        location={location}
        search={search}
        setCategory={setCategory}
        setIsMobileFilterOpen={setIsMobileFilterOpen}
        setLocation={setLocation}
        setPage={setPage}
        setSearch={setSearch}
      />

      {pagination && jobs?.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{start} - {end}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> jobs
        </p>
      )}

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
          {isFetching && !isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[...Array(6)].map((_, i) => (
                <JobCardSkeleton key={i} />
              ))}
            </div>
          )}
          {!isLoading && !isFetching && jobs.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSaved={job.isSaved}
                  onSaveToggle={() => handleSaveToggle(job.id, job.isSaved)}
                  disabled={saveJobMutation.isPending}
                />
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
                {isFiltersSelected ? <>Try adjusting your search or filters to find what you&apos;re looking for.</> : 'No jobs posted on our platform yet.'}
              </p>
              {isFiltersSelected && <button
                onClick={handleClearAllFilters}
                className="text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>}
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
