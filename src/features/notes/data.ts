import { postMarkdownContent } from './content/postContent'
import type { ContentCategory, Post, Section } from './types'

export const parseMarkdown = (markdown: string): Section[] => {
  return markdown
    .split(/^##\s+/m)
    .filter(Boolean)
    .map((block) => {
      const lines = block.split(/\r?\n/)
      const [heading, ...rest] = lines
      const body: string[] = []
      const checklist: string[] = []
      let code = ''
      let inCodeBlock = false

      for (const line of rest) {
        if (line.trim().startsWith('```')) {
          inCodeBlock = !inCodeBlock
          continue
        }

        if (inCodeBlock) {
          code += `${code ? '\n' : ''}${line}`
          continue
        }

        const trimmed = line.trim()
        if (!trimmed) {
          continue
        }

        if (trimmed.startsWith('- ')) {
          checklist.push(trimmed.replace('- ', ''))
          continue
        }

        body.push(trimmed)
      }

      return {
        heading: heading.trim(),
        body,
        ...(checklist.length > 0 ? { checklist } : {}),
        ...(code ? { code } : {}),
      }
    })
}

export const contentCategories: ContentCategory[] = [
  {
    id: 'learning',
    name: '技术学习分享',
    summary: '记录前端、工程实践和认知迭代过程中的关键收获。',
  },
  {
    id: 'reference',
    name: '参考文档',
    summary: '整理概念、规则和常用资料，适合反复查阅与回顾。',
  },
  {
    id: 'tools',
    name: '小工具实现',
    summary: '把重复动作和实验想法做成更轻量、更实用的产物。',
  },
  {
    id: 'essays',
    name: '随笔写作',
    summary: '把日常观察、感受和思考沉淀成更稳定的表达。',
  },
  {
    id: 'reading',
    name: '读书心得',
    summary: '吸收知识与观点，并把它们转化成个人判断力。',
  },
  {
    id: 'cheatsheet',
    name: 'Cheatsheet',
    summary: '用清单和速查方式降低重复决策和反复查找成本。',
  },
]

export const posts: Post[] = [
  {
    id: 'typescript-utility-types',
    category: '技术学习分享',
    title: 'TypeScript Utility Types 实践：从“看懂”到“能落地”',
    summary:
      '这篇笔记整理了我在真实业务代码里常用的 TypeScript 工具类型，并附上了如何把抽象类型转换成可维护交互模型的思路。',
    readTime: '7 min read',
    date: '2026-10-09',
    tags: ['TypeScript', '类型系统', '工程实践'],
    sections: parseMarkdown(postMarkdownContent['typescript-utility-types']),
  },
  {
    id: 'react-state-patterns',
    category: '技术学习分享',
    title: 'React 状态设计：把“复杂”拆成“清晰的几个状态”',
    summary:
      '本文记录了一种更稳妥的状态拆分方式：当功能越来越复杂时，先整理状态边界，再决定谁拥有数据，避免无数 useEffect 和重复渲染。',
    readTime: '6 min read',
    date: '2026-09-21',
    tags: ['React', '状态管理', '组件设计'],
    sections: parseMarkdown(postMarkdownContent['react-state-patterns']),
  },
  {
    id: 'vite-deploy-checklist',
    category: '技术学习分享',
    title: 'Vite 项目部署速查：从本地开发到线上发布',
    summary:
      '这份速查笔记整理了我在 Vite 项目中最常踩的部署细节，包括 build 产物、静态资源处理和环境变量配置。',
    readTime: '5 min read',
    date: '2026-08-12',
    tags: ['Vite', '部署', 'Cheatsheet'],
    sections: parseMarkdown(postMarkdownContent['vite-deploy-checklist']),
  },
  {
    id: 'docs-structure',
    category: '参考文档',
    title: '文档结构化整理：让知识积累持续复用',
    summary:
      '这篇文章总结了我在整理经验时最常使用的文档结构：目标、内容、结论、上下文和复用场景。',
    readTime: '5 min read',
    date: '2026-07-19',
    tags: ['Docs', '知识管理', '方法论'],
    sections: parseMarkdown(postMarkdownContent['docs-structure']),
  },
  {
    id: 'mini-tooling',
    category: '小工具实现',
    title: '从一个“小工具”出发，如何快速验证想法并沉淀成可复用能力',
    summary:
      '小工具不是“玩具”，而是把概念转化为闭环反馈的最小可行验证器，是工程实践里最有价值的入口。',
    readTime: '7 min read',
    date: '2026-06-30',
    tags: ['CLI', 'Automation', '工具化'],
    sections: parseMarkdown(postMarkdownContent['mini-tooling']),
  },
  {
    id: 'product-clarity',
    category: '随笔写作',
    title: '做产品时，最重要的不是“做很多”，而是“留清晰的边界”',
    summary:
      '这篇随笔记录了一条经验：很多功能问题并不是技术问题，而是边界没定清楚，结果就是不断扩张却没有真正积累。',
    readTime: '4 min read',
    date: '2026-05-28',
    tags: ['产品思考', '边界', '工程'],
    sections: parseMarkdown(postMarkdownContent['product-clarity']),
  },
  {
    id: 'reading-notes',
    category: '读书心得',
    title: '读书不是为了记住更多，而是为了看见更多的可能',
    summary:
      '好的阅读并不是“读完”，而是把新视角变成一个可以持续反复调用的判断框架。',
    readTime: '8 min read',
    date: '2026-04-15',
    tags: ['Books', '成长', '阅读'],
    sections: parseMarkdown(postMarkdownContent['reading-notes']),
  },
  {
    id: 'quick-checklist',
    category: 'Cheatsheet',
    title: '我的日常 Cheatsheet：从重复动作到更稳定的工作节奏',
    summary:
      'Cheatsheet 的价值在于它让复杂工作被拆解成可执行、可检查的步骤，减少重复决策的认知负担。',
    readTime: '3 min read',
    date: '2026-02-21',
    tags: ['Checklist', 'Workflow', '效率'],
    sections: parseMarkdown(postMarkdownContent['quick-checklist']),
  },
]

export const authorProfile = {
  name: 'Zane',
  role: '前端工程师 / 博客作者 / AI 协作实践者',
  bio: '我在前端工程、系统化思考和知识沉淀之间寻找稳定的工作方式。这里的内容更偏真实开发经验：如何拆解问题、如何保留上下文、如何把零散知识变成可复用的方法论，而不是单纯展示一个看起来“很厉害”的技术结果。',
  location: '中国 · 远程协作',
  focus: ['前端工程', 'TypeScript', '系统设计', 'AI 协作', '知识管理', '发布运维'],
  stats: [
    { label: '累计文章', value: '18+' },
    { label: '持续主题', value: '12个' },
    { label: '内容方向', value: '6类' },
  ],
}

export const focusAreas = ['技术学习分享', '参考文档', '小工具实现', '随笔写作', '读书心得', 'Cheatsheet']

export const stats = [
  { value: '6', label: '精选文章' },
  { value: '6', label: '内容板块' },
  { value: '4', label: '速查清单' },
]

export const allTags = Array.from(new Set(posts.flatMap((post) => post.tags))).sort((a, b) => a.localeCompare(b))
export const allYears = Array.from(new Set(posts.map((post) => new Date(post.date).getFullYear().toString()))).sort((a, b) => Number(b) - Number(a))

export const socials = [
  { label: 'Email', href: 'mailto:hello@zane.blog' },
  { label: 'GitHub', href: 'https://github.com/warmthlee' },
]
