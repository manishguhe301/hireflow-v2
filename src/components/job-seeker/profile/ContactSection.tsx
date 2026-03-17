import { useProfile } from '@/src/store/hooks/useProfile'
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


const ItemWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2">
      {children}
    </div>
  )
}

const ContactSection = () => {
  const { jobSeekerProfile: profile } = useProfile()
  if (!profile) return null
  return (
    <div className="space-y-3 text-sm text-muted-foreground">
      <ItemWrapper>
        <Mail className="h-4 w-4" />
        {profile.contactEmail}
      </ItemWrapper>

      {profile.phone && <ItemWrapper>
        <Phone className="h-4 w-4" />
        {profile.countryPhoneCode} {profile.phone}
      </ItemWrapper>
      }

      {profile.portfolioWebsite && (
        <ItemWrapper>
          <Globe className="h-4 w-4" />
          <Link href={profile.portfolioWebsite} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300">
            Portfolio
          </Link>
        </ItemWrapper>
      )}

      {profile.githubUrl && (
        <ItemWrapper>
          <Github className="h-4 w-4" />
          <Link href={profile.githubUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 ">
            GitHub
          </Link>
        </ItemWrapper>
      )}

      {profile.linkedinUrl && (
        <ItemWrapper>
          <Linkedin className="h-4 w-4" />
          <Link href={profile.linkedinUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
            LinkedIn
          </Link>
        </ItemWrapper>
      )}

      {profile.twitterUrl && (
        <ItemWrapper>
          <Twitter className="h-4 w-4" />
          <Link href={profile.twitterUrl} target="_blank" className="underline hover:text-primary transition ease-in-out duration-300 transition">
            Twitter
          </Link>
        </ItemWrapper>
      )}

      {(profile.otherLinks && profile.otherLinks.length > 0) &&
        profile.otherLinks.map((link, index) => {
          return <ItemWrapper key={`${link}-${index}`} >
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