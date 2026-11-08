import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section className="grid gap-[22px]">
      <PageHeader
        eyebrow="404"
        title="这个页面不存在。"
        description="链接可能已经失效，或者地址输入有误。可以回到首页或浏览全部笔记。"
        actions={
          <>
            <Button asChild className="h-10 px-4">
              <Link to="/">回到首页</Link>
            </Button>
            <Button asChild variant="outline" className="h-10 px-4">
              <Link to="/notes">浏览笔记</Link>
            </Button>
          </>
        }
      />
    </section>
  )
}
