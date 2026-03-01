import { MessageWithSender } from '@/src/types'
import { formatRelativeTime } from '@/src/utils/helper'
import clsx from 'clsx'
import { CheckCheck } from 'lucide-react'
import React, { memo } from 'react'

const ChatMessage = ({ message, isOwnMessage }: {
  isOwnMessage: boolean,
  message: MessageWithSender
}) => {
  return (
    <div
      className={clsx(
        'flex gap-3 max-w-[80%]',
        isOwnMessage ? 'ml-auto justify-end' : 'mr-auto justify-start',
      )}
    >
      {/* {!isOwnMessage && message.sender.profile?.avatar && (
        //eslint-disable-next-line @next/next/no-img-element
        <img
          src={message.sender.profile.avatar}
          alt={message.sender.name}
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
      )} */}
      {/* {!isOwnMessage && <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center capitalize">
        {message.sender.profile?.name && message.sender.profile.name[0]}
      </div>} */}

      <div
        className={clsx(
          'rounded-2xl px-4 py-2 flex flex-col',
          isOwnMessage
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground',
        )}
      >
        {
          <p className="text-xs font-medium mb-1 opacity-70">
            {isOwnMessage ? 'You' : message.sender.profile && message.sender.profile.name ? message.sender?.profile?.name : message.sender?.name}
          </p>
        }
        <p className="text-sm break-all whitespace-pre-wrap wrap-break-word">{message.content}</p>
        <p
          className={clsx(
            'self-end',
            'text-xs mt-1 flex flex-row items-center gap-1',
            isOwnMessage ? 'text-primary-foreground/70' : 'text-muted-foreground',
          )}
        >
          <CheckCheck size={12} /> {formatRelativeTime(message.createdAt)}
        </p>
      </div>
      {/* {isOwnMessage && <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center capitalize">
        {message.sender.name[0]}
      </div>} */}
    </div>
  )
}

export default memo(ChatMessage)