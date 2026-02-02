'use client'

import { useState, useEffect, useCallback } from 'react'
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

  const debouncedFetch = useCallback(
    debounce(() => {
      setPage(1)
      fetchCompanies()
    }, 500),
    [fetchCompanies]
  )

  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (industry) params.set('industry', industry)
    if (location) params.set('location', location)
    if (page > 1) params.set('page', page.toString())

    router.push(`/explore/companies?${params.toString()}`, { scroll: false })
  }, [search, industry, location, page, router])

  useEffect(() => {
    debouncedFetch()
  }, [search, industry, location, page, debouncedFetch])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-3">Explore Companies</h1>
        <p className="text-lg text-muted-foreground">
          Discover top employers and find your dream job
        </p>
      </div>

      <div className="mb-8 space-y-4 rounded-2xl border border-border/40 bg-card p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative md:col-span-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border/60 bg-background pl-10 pr-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition"
            />
          </div>

          <FormSelect
            label=""
            placeholder="All Industries"
            options={[
              { label: 'All Industries', value: '' },
              ...companyIndustries,
            ]}
            // register={register('industry')}
            onChange={(value) => {
              setIndustry(value)
              setPage(1)
            }}
          />

          <input
            type="text"
            placeholder="Filter by location..."
            value={location}
            onChange={(e) => {
              setLocation(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/30 transition"
          />
        </div>
      </div>

      {pagination && !isLoading && (
        <div className="mb-6 text-sm text-muted-foreground">
          Showing {companies.length} of {pagination.total} companies
        </div>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!isLoading && companies.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {companies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}

      {!isLoading && companies.length === 0 && (
        <div className="text-center py-20">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-muted p-6">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2">No companies found</h3>
          <p className="text-muted-foreground mb-6">
            Try adjusting your filters or search terms
          </p>
          <button
            onClick={() => {
              setSearch('')
              setIndustry('')
              setLocation('')
              setPage(1)
            }}
            className="text-primary hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {!isLoading && pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg border border-border/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                return (
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - page) <= 1
                )
              })
              .map((p, idx, arr) => (
                <>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span key={`ellipsis-${p}`} className="px-2">...</span>
                  )}
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-4 py-2 rounded-lg border transition ${page === p
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'border-border/40 hover:bg-muted'
                      }`}
                  >
                    {p}
                  </button>
                </>
              ))}
          </div>

          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-border/40 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-muted transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}