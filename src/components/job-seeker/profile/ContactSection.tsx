
import React from 'react'
import {
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Link2,
  Twitter,
} from 'lucide-react'
import Link from 'next/link'
import { FullProfile } from '@/src/store/slices/job-seeker/userProfileSlice'
import clsx from 'clsx'


const ItemWrapper = ({ children, className }: {
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <div className={clsx("flex items-center gap-2", className)}>
      {children}
    </div>
  )
}

const ContactSection = ({
  profile,
  className
}: {
  profile: FullProfile
  className?: string
}) => {
  return (
    <div className={clsx("space-y-3 text-sm text-muted-foreground",
      className!
    )}>
      <ItemWrapper className={className && 'py-2!'}>
        <Mail className="h-4 w-4" />
        {profile.contactEmail}
      </ItemWrapper>

      {profile.phone && <ItemWrapper className={className && 'py-2!'}>
        <Phone className="h-4 w-4" />
        {profile.countryPhoneCode} {profile.phone}
      </ItemWrapper>
      }

      {profile.portfolioWebsite && (
        <ItemWrapper className={className && 'py-2!'}>
          <Globe className="h-4 w-4" />
          <Link href={profile.portfolioWebsite} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300">
            Portfolio
          </Link>
        </ItemWrapper>
      )}

      {profile.githubUrl && (
        <ItemWrapper className={className && 'py-2!'}>
          <Github className="h-4 w-4" />
          <Link href={profile.githubUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 ">
            GitHub
          </Link>
        </ItemWrapper>
      )}

      {profile.linkedinUrl && (
        <ItemWrapper className={className && 'py-2!'}>
          <Linkedin className="h-4 w-4" />
          <Link href={profile.linkedinUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
            LinkedIn
          </Link>
        </ItemWrapper>
      )}

      {profile.twitterUrl && (
        <ItemWrapper className={className && 'py-2!'}>
          <Twitter className="h-4 w-4" />
          <Link href={profile.twitterUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
            Twitter
          </Link>
        </ItemWrapper>
      )}

      {(profile.otherLinks && profile.otherLinks.length > 0) &&
        profile.otherLinks.map((link, index) => {
          return <ItemWrapper
            key={`${link}-${index}`}
            className={className && 'py-2!'}>
            <Link2 className="h-4 w-4" />
            <Link href={link} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
              {link}
            </Link>
          </ItemWrapper>
        })
      }
    </div>
  )
}

export default ContactSection