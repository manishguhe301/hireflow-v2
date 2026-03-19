import { formatDate } from '@/src/utils/helper'
import { Certification } from '@prisma/client'
import { Award, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CertificateCard = ({ cert }: { cert: Certification }) => {
  return (
    <div key={cert.id} className="flex items-start gap-3">
      <Award className="h-5 w-5 text-primary" />
      <div>
        <h3 className="font-semibold">{cert.name}</h3>
        <p className="text-sm text-muted-foreground">
          {cert.organization} • Issued {formatDate(cert.issueDate)}
        </p>
        {cert.expiryDate &&
          <p className="text-sm text-muted-foreground">
            Expires {formatDate(cert.expiryDate)}
          </p>
        }
        {cert?.credentialUrl && (
          <Link
            href={cert.credentialUrl}
            target='_blank'
            className='text-sm text-muted-foreground hover:underline flex items-center gap-1 transition ease-in-out duration-300 hover:text-primary'
          >
            Link
            <ExternalLink className='h-3 w-3' />
          </Link>
        )}
      </div>
    </div>)
}

export default CertificateCard