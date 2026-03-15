import { ChatSidebarTopSectionProps } from '@/src/types';
import clsx from 'clsx';
import { RefreshCw } from 'lucide-react';

const ChatSidebarTopSection = ({
  conversations,
  isRefreshing,
  onConversationUpdate,
  setIsRefreshing,
  setSearchQuery,
  searchQuery,
}: ChatSidebarTopSectionProps) => {
  return (
    <div className="p-4 border-b border-border">
      <div className='flex flex-row items-center justify-between gap-2'>
        <h2 className="text-lg font-semibold">Messages</h2>
        <p className="text-xs text-muted-foreground mt-1 flex flex-row items-center gap-2">
          {conversations.length.toLocaleString()} conversation
          {conversations.length !== 1 && 's'}
          <RefreshCw
            onClick={() => {
              if (isRefreshing) return;

              setIsRefreshing(true);
              onConversationUpdate();

              setTimeout(() => setIsRefreshing(false), 1000);
            }}
            size={16}
            className={clsx(
              'transition',
              isRefreshing && 'animate-spin opacity-50 cursor-not-allowed'
            )}
          />
        </p>
      </div >

      <div className="relative mt-2">

        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
          aria-label="Search conversations"
          className={
            clsx(
              ' mt-2 w-full rounded-xl border px-2 py-2 text-sm outline-none transition',
              'bg-background text-foreground border-border/60 focus:border-primary/40 focus:ring-1 focus:ring-primary/30',
              'appearance-none',)
          }
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-[60%] -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        )}
      </div>
    </div >
  )
}

export default ChatSidebarTopSection