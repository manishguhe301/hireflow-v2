'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import clsx from 'clsx'
import { useEffect } from 'react'
import { Bold, Italic, List } from 'lucide-react'

type RichTextEditorProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
}

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  disabled,
}: RichTextEditorProps) => {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder || '',
      }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || '')
    }
  }, [value, editor])

  return (
    <div className="space-y-1">
      <label className="text-sm text-muted-foreground">
        {label}
      </label>

      <div
        className={clsx(
          'rounded-xl border bg-background overflow-hidden',
          'focus-within:ring-1 focus-within:ring-primary/40',
          error ? 'border-destructive/60' : 'border-border/60'
        )}
      >

        {editor && (
          <div className="flex gap-1 border-b border-border/40 px-2 py-1">
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={clsx(
                'px-2 py-1 text-sm rounded',
                editor.isActive('bold') && 'bg-border'
              )}
            >
              <Bold size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={clsx(
                'px-2 py-1 text-sm rounded italic',
                editor.isActive('italic') && 'bg-border'
              )}
            >
              <Italic size={16} />
            </button>

            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={clsx(
                'px-2 py-1 text-sm rounded',
                editor.isActive('bulletList') && 'bg-border'
              )}
            >
              <List size={16} />
            </button>
          </div>
        )}

        <EditorContent
          editor={editor}
          className="w-full min-h-36 max-h-40 overflow-y-scroll px-3 py-2 text-sm focus:outline-none"
        />
      </div>


      {error && (
        <p className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  )
}

export default RichTextEditor
