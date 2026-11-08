import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { eyebrow, pillActive } from '@/lib/styles'
import type { Post } from '../types'

type NoteBodyProps = {
  post: Post
}

async function writeClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export function NoteBody({ post }: NoteBodyProps) {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const copyTimer = useRef<number | null>(null)

  useEffect(
    () => () => {
      if (copyTimer.current !== null) {
        window.clearTimeout(copyTimer.current)
      }
    },
    [],
  )

  const copyCode = async (code: string, index: number) => {
    try {
      await writeClipboard(code)
    } catch {
      return
    }

    setCopiedIndex(index)
    if (copyTimer.current !== null) {
      window.clearTimeout(copyTimer.current)
    }
    copyTimer.current = window.setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <>
      <nav
        className="sticky top-[100px] grid gap-3 self-start rounded-[20px] border border-border bg-card p-3.5 max-[980px]:static"
        aria-label="Article table of contents"
      >
        <p className={eyebrow}>目录</p>
        {post.sections.map((section, index) => (
          <button
            key={`${section.heading}-${index}`}
            type="button"
            className={cn(
              'w-full rounded-full border border-border bg-card/75 px-[0.7rem] py-[0.52rem] text-left text-muted-foreground transition hover:-translate-y-px',
              currentSectionIndex === index && pillActive,
            )}
            aria-current={currentSectionIndex === index ? 'location' : undefined}
            onClick={() => {
              setCurrentSectionIndex(index)
              document
                .getElementById(`article-section-${index}`)
                ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            {section.heading}
          </button>
        ))}
      </nav>

      <div className="grid gap-7">
        {post.sections.map((section, index) => (
          <section
            key={`${section.heading}-${index}`}
            id={`article-section-${index}`}
            className="scroll-mt-24"
          >
            <h3 className="mb-3.5 text-[clamp(1.22rem,1.7vw,1.7rem)] font-semibold text-foreground">
              {section.heading}
            </h3>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="m-0 text-[1.06rem] leading-[1.9] text-foreground">
                {paragraph}
              </p>
            ))}
            {section.checklist && (
              <ul className="mt-4 list-disc pl-5 leading-[1.9] text-foreground">
                {section.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
            {section.code && (
              <div className="mt-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">代码示例</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    aria-label={`复制第 ${index + 1} 段代码`}
                    onClick={() => void copyCode(section.code ?? '', index)}
                  >
                    {copiedIndex === index ? '已复制' : '复制代码'}
                  </Button>
                </div>
                <pre className="mt-0 overflow-x-auto rounded-[18px] border border-border bg-code px-5 py-[18px] font-mono text-[0.92rem] leading-[1.7] whitespace-pre-wrap text-foreground">
                  {section.code}
                </pre>
                <span className="sr-only" aria-live="polite">
                  {copiedIndex === index ? '代码已复制' : ''}
                </span>
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  )
}
