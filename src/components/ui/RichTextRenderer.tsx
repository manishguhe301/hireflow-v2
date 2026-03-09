import DOMPurify from 'dompurify'
type RichTextRendererProps = {
  content: string
}

const RichTextRenderer = ({ content }: RichTextRendererProps) => {
  if (!content) return null

  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
    />
  )
}

export default RichTextRenderer
