type PageHeaderProps = {
  title: string
  subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="page-header" style={{ justifyContent:"center"}}>
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="small-text" style={{ marginTop: 12 }}>{subtitle}</p> : null}
    </div>
  )
}
