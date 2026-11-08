import { describe, expect, it } from 'vitest'
import css from './index.css?raw'

function readTokens(selector: string) {
  const start = css.indexOf(`${selector} {`)
  expect(start, `missing ${selector} block`).toBeGreaterThanOrEqual(0)
  const end = css.indexOf('}', start)
  const block = css.slice(start, end)
  const tokens: Record<string, string> = {}

  for (const match of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) {
    tokens[match[1]] = match[2].toLowerCase()
  }

  return tokens
}

function luminance(hex: string) {
  const value = hex.replace('#', '')
  const channels = [0, 2, 4].map((offset) => {
    const channel = Number.parseInt(value.slice(offset, offset + 2), 16) / 255
    return channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  })

  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]
}

function contrast(a: string, b: string) {
  const first = luminance(a)
  const second = luminance(b)
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05)
}

const light = readTokens(':root')
const dark = readTokens('.dark')

describe('design token contrast', () => {
  it.each([
    ['light foreground/background', light, 'foreground', 'background'],
    ['light muted/background', light, 'muted-foreground', 'background'],
    ['light foreground/card', light, 'foreground', 'card'],
    ['light muted/card', light, 'muted-foreground', 'card'],
    ['dark foreground/background', dark, 'foreground', 'background'],
    ['dark muted/background', dark, 'muted-foreground', 'background'],
    ['dark foreground/card', dark, 'foreground', 'card'],
    ['dark muted/card', dark, 'muted-foreground', 'card'],
    ['light primary-foreground/primary', light, 'primary-foreground', 'primary'],
    ['dark primary-foreground/primary', dark, 'primary-foreground', 'primary'],
    ['light brand-text/background', light, 'brand-text', 'background'],
    ['light brand-text/card', light, 'brand-text', 'card'],
    ['dark brand-text/background', dark, 'brand-text', 'background'],
    ['dark brand-text/card', dark, 'brand-text', 'card'],
  ])('%s meets WCAG AA for text', (_label, tokens, foreground, background) => {
    expect(contrast(tokens[foreground], tokens[background])).toBeGreaterThanOrEqual(4.5)
  })
})

describe('focus and motion rules', () => {
  it('keeps a visible focus outline', () => {
    expect(css).toContain(':focus-visible')
    expect(css).toMatch(/outline:\s*2px solid var\(--ring\)/)
    expect(css).toMatch(/outline-offset:\s*2px/)
  })

  it('respects prefers-reduced-motion', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)')
    expect(css).toMatch(/animation-duration:\s*0\.01ms !important/)
    expect(css).toMatch(/transition-duration:\s*0\.01ms !important/)
    expect(css).toMatch(/scroll-behavior:\s*auto !important/)
  })
})
