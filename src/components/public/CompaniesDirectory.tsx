'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Search, Briefcase } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '../elements/Loader'
import { FormSelect } from '../ui/FormSelect'
import { debounce } from '@/src/utils/helper'
import { companyIndustries } from '@/src/utils/mock'
import CompanyCard from './CompanyCard'

type Company = {
  id: string
  name: string
  logo: string | null
  industry: string
  location: string
  companySize: string
  jobCount: number
}

type Pagination = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function CompaniesDirectory() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [companies, setCompanies] = useState<Company[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [industry, setIndustry] = useState(searchParams.get('industry') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'))

  const debouncedFetchRef = useRef<ReturnType<typeof debounce> | null>(null)


  const fetchCompanies = useCallback(async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (industry) params.set('industry', industry)
      if (location) params.set('location', location)
      params.set('page', page.toString())
      params.set('limit', '12')

      const res = await fetch(`/api/companies?${params.toString()}`)
      const data = await res.json()

      setCompanies(data.companies || [])
      setPagination(data.pagination)
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setIsLoading(false)
    }
  }, [search, industry, location, page])

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (industry) params.set('industry', industry)
    if (location) params.set('location', location)
    if (page > 1) params.set('page', page.toString())

    router.push(`/explore/companies?${params.toString()}`, { scroll: false })
  }, [search, industry, location, page, router])

  // const debouncedFetch = useCallback(
  //   debounce(() => {
  //     setPage(1)
  //     fetchCompanies()
  //   }, 500),
  //   [fetchCompanies]
  // )

  // useEffect(() => {
  //   debouncedFetch()
  // }, [search, industry, location, page, debouncedFetch])

  if (!debouncedFetchRef.current) {
    debouncedFetchRef.current = debounce(() => {
      fetchCompanies()
    }, 500)
  }

  useEffect(() => {
    debouncedFetchRef.current?.()
  }, [search, industry, location, page])


  return (
    <div className="mx-auto max-w-7xl px-4 py-10 space-y-10">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Explore Companies</h1>
        <p className="text-muted-foreground text-lg">
          Discover verified companies hiring right now
        </p>
      </div>

      <div className="rounded-3xl border border-border/40 bg-card p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies by name…"
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
            placeholder="All Industries"
            options={[
              { label: 'All Industries', value: '' },
              ...companyIndustries,
            ]}
            onChange={(value) => {
              setIndustry(value)
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
          Showing <span className="font-medium text-foreground">{companies.length}</span> of{' '}
          <span className="font-medium text-foreground">{pagination.total}</span> companies
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-24">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && companies.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {!isLoading && companies.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <Briefcase className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-1">No companies found</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm">
            Try adjusting your search or filters to find what you’re looking for.
          </p>
          <button
            onClick={() => {
              setSearch('')
              setIndustry('')
              setLocation('')
              setPage(1)
            }}
            className="text-sm font-medium text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-border/40 px-4 py-2 text-sm transition hover:bg-muted disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === pagination.totalPages ||
                Math.abs(p - page) <= 1
            )
            .map((p, idx, arr) => (
              <span key={p} className="flex items-center gap-2">
                {idx > 0 && arr[idx - 1] !== p - 1 && (
                  <span className="px-1 text-muted-foreground">…</span>
                )}
                <button
                  onClick={() => setPage(p)}
                  className={`rounded-lg px-4 py-2 text-sm transition ${page === p
                    ? 'bg-primary text-primary-foreground'
                    : 'border border-border/40 hover:bg-muted'
                    }`}
                >
                  {p}
                </button>
              </span>
            ))}

          <button
            onClick={() =>
              setPage((p) => Math.min(pagination.totalPages, p + 1))
            }
            disabled={page === pagination.totalPages}
            className="rounded-lg border border-border/40 px-4 py-2 text-sm transition hover:bg-muted disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}