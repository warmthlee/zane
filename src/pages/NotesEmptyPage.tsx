import { eyebrow, surface } from '@/lib/styles'

export function NotesEmptyPage() {
  return (
    <div className={`${surface} grid min-h-[360px] content-center gap-3 px-[26px] py-7`}>
      <p className={eyebrow}>暂无内容</p>
      <h2 className="m-0 text-[clamp(2rem,3vw,2.8rem)] font-semibold text-foreground">
        选择一篇笔记开始阅读。
      </h2>
      <p className="m-0 leading-[1.7] text-muted-foreground">
        从左侧列表选择文章，或使用搜索与筛选缩小范围。
      </p>
    </div>
  )
}
