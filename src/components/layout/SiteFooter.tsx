import { Button } from '@/components/ui/button'
import { socials } from '@/features/notes/data'
import { eyebrow } from '@/lib/styles'

export function SiteFooter() {
  return (
    <footer className="mt-10 flex items-center justify-between gap-4 rounded-3xl border border-border bg-card/75 px-6 py-5 shadow-elevation max-lg:flex-col max-lg:items-start max-sm:px-4">
      <div>
        <p className={eyebrow}>保持联系</p>
        <h3 className="m-0 text-[clamp(1.3rem,2vw,2rem)] font-semibold text-foreground">
          记录小问题、整理大思路。
        </h3>
      </div>

      <div className="flex flex-wrap items-center gap-3.5">
        <div className="flex flex-wrap gap-3.5 text-muted-foreground" aria-label="Social links">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="transition hover:text-foreground"
            >
              {social.label}
            </a>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          回到顶部
        </Button>
      </div>
    </footer>
  )
}
