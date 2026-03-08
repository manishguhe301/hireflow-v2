import { MessageWithSender } from '@/src/types'
import { formatRelativeTime } from '@/src/utils/helper'
import clsx from 'clsx'
import { CheckCheck } from 'lucide-react'
import { memo } from 'react'

const ChatMessage = ({
  message,
  isOwnMessage
}: {
  isOwnMessage: boolean
  message: MessageWithSender
}) => {
  const name =
    isOwnMessage
      ? 'You'
      : message.sender.profile?.name || message.sender?.name

  return (
    <div
      className={clsx(
        "w-full flex",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={clsx(
          "max-w-[75%] px-3 py-2 rounded-xl transition hover:bg-muted/30",
          isOwnMessage
            ? "bg-muted/40 text-foreground"
            : "bg-muted/10 text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="font-medium text-foreground">
            {name}
          </span>

          <span className="text-[10px]">
            {formatRelativeTime(message.createdAt)}
          </span>

          {isOwnMessage && (
            <CheckCheck size={12} className="opacity-70" />
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  )
}

export default memo(ChatMessage)