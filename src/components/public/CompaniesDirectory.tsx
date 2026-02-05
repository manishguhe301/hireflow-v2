'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, Briefcase } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Spinner } from '../elements/Loader'
import { FormSelect } from '../ui/FormSelect'
import CompanyCard from './CompanyCard'
import Pagination from '../ui/Pagination'
import { companyIndustries } from '@/src/utils/utils'

type Company = {
  id: string
  name: string
  logo: string | null
  industry: string
  country: string
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
      if (location) params.set('country', location)
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

  useEffect(() => {
    const shouldDebounce = search.length > 0
    const delay = shouldDebounce ? 500 : 0

    const timer = setTimeout(() => {
      fetchCompanies()
    }, delay)

    return () => clearTimeout(timer)
  }, [search, industry, location, page, fetchCompanies])

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