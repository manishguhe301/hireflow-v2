import { getFileNameFromPath } from "@/src/utils/helper"
import clsx from "clsx"

const FileItem = ({
  label,
  file,
  existingFileUrl,
  required = true
}: {
  label: string
  file?: FileList
  existingFileUrl?: string | null
  required?: boolean
}) => {
  const newFileName = file?.[0]?.name

  const existingFileName = existingFileUrl ?
    getFileNameFromPath(existingFileUrl) : null

  const displayName = newFileName || existingFileName
  const hasFile = !!(newFileName || existingFileName)

  return (
    <div>
      <p className="text-xs text-muted-foreground">
        {label}
        {required && !hasFile && <span className="text-red-500 ml-1">*</span>}
      </p>
      <div className="flex items-center gap-2">
        <p className={clsx(
          'font-medium truncate',
          !hasFile && required && 'text-red-500',
          !hasFile && !required && 'text-muted-foreground'
        )}>
          {displayName || (required ? 'Required' : 'Not uploaded')}
        </p>
        {!newFileName && existingFileName && (
          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
            Existing
          </span>
        )}
      </div>
    </div>
  )
}

export default FileItem