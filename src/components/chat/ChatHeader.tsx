import React from 'react'
import { Button } from '../ui/Button'
import { MoveLeft } from 'lucide-react';

interface ChatHeaderProps {
  onBack?: () => void;
  chatPartnerAvatar?: string | null;
  chatPartnerName?: string;
  jobTitle?: string;
}

export const MobileChatHeader = ({
  onBack,
  chatPartnerAvatar,
  chatPartnerName,
  jobTitle
}: ChatHeaderProps
) => {
  return (
    <div className="p-3 border-b flex items-center gap-3 sm:hidden bg-card">
      <Button
        variant="ghost"
        size='sm'
        onClick={onBack}
        aria-label='Go Back'
        className="p-2!"
      >
        <MoveLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 min-w-0 flex items-center gap-3 ">
        {chatPartnerAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={chatPartnerAvatar}
            alt={chatPartnerName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {chatPartnerName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="font-semibold text-sm truncate">{chatPartnerName}</p>
          {jobTitle && (
            <p className="text-[10px] text-muted-foreground truncate line-clamp-1">
              {jobTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export const DesktopChatHeader = ({
  chatPartnerAvatar,
  chatPartnerName,
  jobTitle
}: ChatHeaderProps) => {
  return (
    <div className="hidden sm:flex items-center justify-between border-b border-border px-4 py-3 bg-card">
      <div className="flex items-center gap-3 min-w-0">
        {chatPartnerAvatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={chatPartnerAvatar}
            alt={chatPartnerName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-semibold text-sm">
              {chatPartnerName?.charAt(0).toUpperCase()}
            </span>
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{chatPartnerName}</p>

          {jobTitle && (
            <p className="text-xs text-muted-foreground truncate">
              Re: {jobTitle}
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 