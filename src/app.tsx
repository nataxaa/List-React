import {FileDown, Filter, MoreHorizontal, Plus, Search} from 'lucide-react'
import { Header } from './components/header'
import { Tabs } from './components/tabs'
import { Control, Input } from './components/ui/input'
import { Button } from './components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './components/ui/table'
import { Pagination } from './components/pagination'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import useDebounceValue from './hooks/use_debounce_filter'
import { FormEvent, useState } from 'react'


export interface TagResponse {
  first: number
  prev: number | null
  next: number
  last: number
  pages: number
  items: number
  data: Tag[]
}

export interface Tag {
  title: string
  slug: string
  amountOfVideos: number
  id: string
}

export function App() {

  const [searchParams, setSearchParams] = useSearchParams()
  const urlFilter = searchParams.get('filter') ?? ''
  const page  = searchParams.get('page') ? Number(searchParams.get('page')) : 1 
  const per_page  = searchParams.get('per_page') ? Number(searchParams.get('per_page')) : 5
  const [filter, setFilter] = useState(urlFilter)

 // const debounceFilter = useDebounceValue(filter, 1000)

  const {data : tagsResponse, isLoading} = useQuery<TagResponse>({
    queryKey: ['get-tags', page, urlFilter, per_page],
    queryFn: async () => {
      const response = await fetch(`http://localhost:3333/tags?_page=${page}&_per_page=${per_page}&title=${urlFilter}`)
      const data = await response.json()

      return data
    },
    placeholderData: keepPreviousData
  })

  function handleFilter(event: FormEvent) {
    event.preventDefault()

    setSearchParams(params => {
      params.set('page', '1')
      params.set('filter', filter)
      
      return params
    })
  }

  if(isLoading){
    return null
  }

  return (
    <div className="py-10 space-y-8">
      <div>
        <Header/>
        <Tabs/>
      </div>
      <main className="max-w-6xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
            <Plus className='size-3'/>
            <button className='inline-flex items-center gap-1.5 text-xs bg-teal-500 text-teal-950 font-medium rounded-full px-1.5 py-1 '>
              Create new
            </button>
        </div>

        <div className='flex items-center justify-between'>
          <form onSubmit={handleFilter} className='flex items-center gap-2'>
            <Input variant='filter'>
              <Search className='size-3'/>
              <Control
                value={filter} 
                onChange={e => setFilter(e.target.value)} 
                placeholder='Search tags...'
              />
            </Input>
            <Button type='submit'>
              <Filter className='size-3'/>
              Filter
            </Button>
          </form>

          <Button>
            <FileDown className='size-3'/>
            Export
          </Button>  
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Amout of videos</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tagsResponse?.data?.map((tag)=>{
              return(
              <TableRow key={tag.id}>
                <TableCell></TableCell>
                <TableCell>
                  <div className='flex flex-col gap-0.5'>
                    <span className='font-medium'>{tag.title}</span>
                    <span className='text-xs text-zinc-500'>{tag.slug}</span>
                  </div>
                </TableCell>
                <TableCell className='text-zinc-300'>{tag.amountOfVideos} video(s)</TableCell>
                <TableCell className='text-right'>
                  <Button size='icon'>
                    <MoreHorizontal className='size-4'/>
                  </Button>
                </TableCell>
              </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <Pagination total={50} page={page} pages={10} items={per_page}/>
      </main>
    </div>
  )
}

