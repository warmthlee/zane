## 为什么要专门记这类类型

很多前端工程中的复用问题，不是“功能不够”，而是“类型抽象不够”。尤其在涉及 API 响应、表单状态、组件 Props 和状态机时，强类型是减少 bug 的关键工具。

我最常用的一句话是：先定义“数据的形状”，再决定“行为如何扩展”。这也是 Utility Types 适合进入项目的原因：它能帮助我们在不写大量重复类型的前提下，保留清晰的语义层次。

## 工作中常见的几种类型

Partial、Pick、Omit、Required 和 Record 是最基础的组合。它们经常出现在表单编辑、列表筛选和配置项映射场景中。最重要的是：不要把它们当成“语法糖”，而要把它当成统一抽象的表达方式。

比如我们有一份 User 结构，编辑页只需要部分字段时，用 Partial<User> 很自然；在某些 API 层我们需要把所有可选字段强制要求填写时，则使用 Required<User>。

- Partial<User>：适合编辑表单
- Pick<User, "id" | "name">：适合只取必要字段
- Omit<User, "password">：适合外部展示模型

```ts
type User = {
  id: string
  name: string
  email: string
  password: string
  role: 'admin' | 'editor'
}

type SafeUser = Omit<User, 'password'>
type EditableUser = Partial<User>
type RoleMap = Record<User['role'], string>
```

## 一种更实用的思维方式

工程里最容易踩坑的地方不是“知道某个 Utility Type 能写”，而是“你是否真的拿它来描述业务模型”。我更推荐的顺序是：先把接口、状态和 UI 需求拆开，再决定使用哪一层类型。

例如一个搜索表单可能同时需要：展示模型、提交模型、过滤模型。三者在字段层面可以共享一部分，但表达语义不同。这个时候拆分成多个小类型，往往比一个大而全的类型更利于维护。
