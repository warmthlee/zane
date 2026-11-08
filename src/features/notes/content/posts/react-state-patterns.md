## 复杂状态的真正难点

大多数 React 状态问题并不是“数据量大”，而是“状态职责混在一起”。如果一个组件同时承担表单状态、请求状态、缓存状态和页面展示状态，后续改动就会很痛苦。

更好的方法，是将状态按“来源”来分层：用户输入、服务器返回、派生结果。这样最终组件代码会更清晰，也更容易复用。

## 一个可落地的状态拆分原则

先把状态一分为三：input、model、view。input 是用户正在修改的值，model 是最终提交或展示的数据，view 是从 model 派生出来的 UI 状态。

这样做的好处是，UI 层根本不需要直接关心业务层的很多临时字段。状态边界清楚了，渲染就稳定了，调试也更轻松。

- 输入状态保持同步
- 提交状态与展示状态分离
- 通过派生值减少重复状态

## 解法示例

对一个表单来说，最常见的误区是把字段值、校验结果、提交中状态、成功状态全部压进一个对象。更合理的做法是：用一个 inputState 记录表单值，用一个 submitState 表示请求状态，再用 useMemo 生成派生字段。

```ts
const [draft, setDraft] = useState({ name: '', email: '' })
const [submitState, setSubmitState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

const canSubmit = draft.name && draft.email && submitState !== 'loading'
```
