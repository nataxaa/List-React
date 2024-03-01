import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger } from './ui/select'
import { useEffect, useState } from 'react'

interface PaginationProps {
  pages: number
  items: number
  page: number
  total:number 
}

export function Pagination({ items, page, pages, total }: PaginationProps) {
  const [, setSearchParams] = useSearchParams()
  const [per_page, setPer_page ] = useState<string>(items.toString())

  console.log(total)

  function firstPage() {
    setSearchParams(params => {
      params.set('page', '1')

      return params
    })
  }

  function previousPage() {
    if (page - 1 <= 0) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page - 1))

      return params
    })
  }

  function nextPage() {
    if (page + 1 > pages) {
      return
    }

    setSearchParams(params => {
      params.set('page', String(page + 1))

      return params
    })
  }

  function lastPage() {
    setSearchParams(params => {
      params.set('page', String(pages))

      return params
    })
  }

  useEffect(()=>{
    setSearchParams(params => {
      params.set('page', '1')
      params.set('per_page', per_page)

      return params
    })
  },[per_page])
  

  return (
    <div className="flex text-sm items-center justify-between text-zinc-500">
      <span>Showing {per_page} of {total} items</span>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span>{per_page} Rows per page </span>

          <Select defaultValue='5' onValueChange={setPer_page} >
            <SelectTrigger aria-label="Page" />
            <SelectContent >
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <span>Page {page} of {pages}</span>

        <div className="space-x-1.5">
          <Button onClick={firstPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronsLeft className="size-4" />
            <span className="sr-only">First page</span>
          </Button>
          <Button onClick={previousPage} size="icon" disabled={page - 1 <= 0}>
            <ChevronLeft className="size-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button onClick={nextPage} size="icon" disabled={page + 1 > pages}>
            <ChevronRight className="size-4" />
            <span className="sr-only">Next page</span>
          </Button>
          <Button onClick={lastPage} size="icon" disabled={page + 1 > pages}>
            <ChevronsRight className="size-4" />
            <span className="sr-only">Last page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
