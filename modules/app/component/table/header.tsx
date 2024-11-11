import Caret from '@/assets/caret.svg'
import { ReactNode } from 'react'
import { HeaderContext } from '@tanstack/react-table'
import { cn } from '../../utils'


type HeaderProps<T> = {
  children: ReactNode
  column: HeaderContext<T, unknown>['column']
  noSort?: boolean
}

export function ColumnHeader<T>({ children, column, noSort = false }: HeaderProps<T>) {
  const sort = column.getIsSorted()

  return (
    <div
      className="flex gap-2 items-center cursor-pointer text-sm font-normal text-muted-foreground"
      onClick={column.getToggleSortingHandler()}
    >
      {children}
      {!noSort && (
        <div className="flex gap-[1px] flex-col justify-center items-center">
          <Caret className={cn('rotate-180', sort === 'asc' && 'text-muted')} />
          <Caret className={cn(sort === 'desc' && 'text-muted')} />
        </div>
      )}
    </div>
  )
}
