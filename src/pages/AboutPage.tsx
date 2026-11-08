import { stats } from '@/features/notes/data'
import { eyebrow, surface } from '@/lib/styles'

export function AboutPage() {
  return (
    <section className="grid gap-[22px] min-[980px]:grid-cols-[minmax(0,1.25fr)_minmax(260px,0.75fr)]">
      <div className={`${surface} min-h-[360px] px-[22px] py-6`}>
        <p className={eyebrow}>关于</p>
        <h1 className="mb-3.5 text-[clamp(2rem,3vw,2.7rem)] leading-[1.1] font-semibold text-foreground">
          我希望博客像一本温暖而实用的技术手册，而不是一张浮夸的宣传海报。
        </h1>
        <p className="m-0 leading-[1.85] text-muted-foreground">
          这里的内容更偏工程学习、知识沉淀、文档化整理和反思式写作。很多文章都来自真实的学习过程，有时会附上代码样例、速查清单和工具思路，也会从技术学习分享、参考文档、小工具实现、随笔写作、读书心得和 Cheatsheet 这些板块中持续积累。目标是让阅读者不只看到结论，更能看到“怎么走到结论”。
        </p>
        <p className="m-0 leading-[1.85] text-muted-foreground">
          从前端开发、工程协作到 AI 辅助编程，我都在尝试让工作更稳定、知识更持续、交付更清晰。这个博客不是为了制造流量，而是为了让自己和未来的阅读者在面对复杂问题时，能更快地找到参考、判断和下一步行动。
        </p>
        <p className="m-0 leading-[1.85] text-muted-foreground">
          我希望内容尽量温和、稳定、可信。就像写一本长期保值的笔记：不追热点，不急着展示，不为了阅读时的刺激而牺牲内容的清晰度。
        </p>
      </div>

      <div
        className={`${surface} grid grid-cols-3 gap-[18px] self-start p-[18px] max-sm:grid-cols-1`}
        aria-label="About statistics"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="grid gap-2.5 border border-border bg-card p-4">
            <strong className="text-[clamp(1.5rem,2vw,2rem)] text-foreground">
              {stat.value}
            </strong>
            <span className="text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
