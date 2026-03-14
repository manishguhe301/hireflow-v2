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
  message: MessageWithSender & { isSending: boolean }
}) => {
  const name =
    isOwnMessage
      ? 'You'
      : message.sender.profile?.name || message.sender?.name

  const avatar =
    message.sender.profile?.avatar || ''

  const fallbackLetter = name?.charAt(0)?.toUpperCase()

  const Avatar = (
    avatar ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatar}
        alt={name}
        loading="lazy"
        className="h-8 w-8 rounded-full object-cover shrink-0"
      />
    ) : (
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
        {fallbackLetter}
      </div>
    )
  )

  return (
    <div
      className={clsx(
        "w-full flex items-start gap-3",
        isOwnMessage ? "justify-end" : "justify-start"
      )}
    >
      {!isOwnMessage && Avatar}

      <div
        className={clsx(
          "max-w-[70%] px-3 py-2 rounded-xl transition hover:bg-muted/30",
          isOwnMessage
            ? "bg-muted/40 text-foreground"
            : "bg-muted/10 text-muted-foreground"
        )}
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
          <span className="font-medium text-foreground">
            {name}
          </span>

          {isOwnMessage && (
            message.isSending ? (
              <span className="text-[10px] text-muted-foreground">sending...</span>
            ) : (
              <>
                <span className="text-[10px]">
                  {formatRelativeTime(message.createdAt)}
                </span>

                <CheckCheck size={12} className="opacity-70" />
              </>
            )
          )}
        </div>

        <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>

      {isOwnMessage && Avatar}
    </div>
  )
}

export default memo(ChatMessage)