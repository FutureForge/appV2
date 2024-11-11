import { Card } from '../card'
// import Wallet from '@/icons/wallet.svg'

type TableEmptyStateProps = {
  title?: string
  message?: string
}

export function TableEmptyState({ title, message }: TableEmptyStateProps) {
  return (
    <div className="min-h-[168px] flex items-center justify-center text-center flex-col w-full">
      <p className="font-semibold text-sm mb-1">{title}</p>
      <span className="text-muted-foreground font-normal text-sm">{message}</span>
    </div>
  )
}
