import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

export function RichText({ data }: { data: SerializedEditorState }) {
  return (
    <div className="rich-text">
      <LexicalRichText data={data} />
    </div>
  )
}
