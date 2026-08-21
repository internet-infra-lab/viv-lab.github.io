import PageHeader from '../components/PageHeader'
import EmptyState from '../components/EmptyState'

/**
 * 「建设中」占位页：对应本期未实现的栏目（导师介绍/科研项目/招生招聘）
 */
export default function ComingSoon({ title }) {
  return (
    <>
      <PageHeader title={title} />
      <div className="container">
        <EmptyState
          title="内容更新中"
          desc={`「${title}」栏目正在建设中，敬请期待。如需了解相关信息，可先浏览其他栏目。`}
        />
      </div>
    </>
  )
}
