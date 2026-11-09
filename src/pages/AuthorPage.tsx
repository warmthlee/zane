import { authorProfile } from '@/features/notes/data'
import { eyebrow, surface } from '@/lib/styles'

export function AuthorPage() {
  return (
    <section className="grid gap-[22px] min-[980px]:grid-cols-3">
      <div className={`${surface} px-[22px] py-6`}>
        <p className={eyebrow}>作者</p>
        <h1 className="text-[clamp(2rem,3vw,2.7rem)] leading-[1.1] font-semibold text-foreground">
          {authorProfile.name}
        </h1>
        <p className="mb-3.5 font-semibold text-foreground">{authorProfile.role}</p>
        <p className="m-0 leading-[1.85] text-muted-foreground">{authorProfile.bio}</p>
        <ul className="mt-4 grid list-none gap-1.5 p-0 text-muted-foreground">
          <li>{authorProfile.location}</li>
          <li>写作以长期可用性为目标</li>
        </ul>
      </div>

      <div className={`${surface} px-[22px] py-6`}>
        <p className={eyebrow}>关注领域</p>
        <div className="flex flex-wrap gap-2">
          {authorProfile.focus.map((item) => (
            <span
              key={item}
              className="inline-flex rounded-full border border-border bg-muted px-[0.72rem] py-[0.46rem] text-foreground"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className={`${surface} px-[22px] py-6`}>
        <p className={eyebrow}>数据概览</p>
        <div className="grid gap-2.5">
          {authorProfile.stats.map((stat) => (
            <div key={stat.label} className="grid gap-1">
              <strong className="text-[1.3rem] text-foreground">{stat.value}</strong>
              <span className="text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
