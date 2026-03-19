import { isRichTextEmpty } from '@/src/utils/helper'
import React from 'react'
import DOMPurify from 'dompurify'

const JobInfo = ({
  description,
  requirements,
  responsibilities,
}: {
  description: string
  requirements: string
  responsibilities: string
}
) => {
  return (
    <>
      {!isRichTextEmpty(description) && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Job Description</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(description) }}
          />
        </div>
      )}

      {!isRichTextEmpty(requirements) && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Requirements</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(requirements) }}
          />
        </div>
      )}

      {!isRichTextEmpty(responsibilities) && (
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Responsibilities</h3>
          <div
            className="prose prose-sm max-w-none dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(responsibilities) }}
          />
        </div>
      )}
    </>
  )
}

export default JobInfo