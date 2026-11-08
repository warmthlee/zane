import { socials } from '@/features/notes/data'

export function SiteFooter() {
  return (
    <footer id="newsletter" className="site-footer">
      <div>
        <p className="eyebrow-alt">保持联系</p>
        <h3>记录小问题、整理大思路。</h3>
      </div>

      <div className="social-links" aria-label="Social links">
        {socials.map((social) => (
          <a key={social.label} href={social.href}>
            {social.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
