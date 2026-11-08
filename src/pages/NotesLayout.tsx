import { Outlet } from 'react-router-dom'
import { PageHeader, TagPill } from '@/components/common'
import { NotesSidebar } from '@/features/notes/components/NotesSidebar'

export function NotesLayout() {
  return (
    <section className="grid gap-[22px] min-[980px]:grid-cols-[minmax(260px,360px)_minmax(0,1fr)]">
      <PageHeader
        eyebrow="文章列表"
        title="把学习、记录和复用沉淀成一条稳定的写作脉络。"
        className="col-span-full"
        actions={
          <>
            <TagPill>首页</TagPill>
            <TagPill>分类</TagPill>
            <TagPill>文章</TagPill>
          </>
        }
      />

      <NotesSidebar />

      <Outlet />
    </section>
  )
}
