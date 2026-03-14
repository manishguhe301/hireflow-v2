import clsx from "clsx"

const DataTable = ({ children, className }: {
  children: React.ReactNode,
  className?: string
}) => {
  return (
    <table className={className}>
      {children}
    </table>
  )
}

const DataTableHeader = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <thead className={clsx('bg-muted/40 border-b border-border/60', className)}>
      {children}
    </thead >
  )
}

const DataTableHeadCell = ({ children, className }:
  { children: React.ReactNode, className?: string }) => {
  return (
    <th scope="col" className={clsx("px-6 py-4 text-left", className!)}>{children}</th>
  )
}

const DataTableBody = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <tbody className={className}>{children}</tbody>
  )
}

const DataTableRow = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <tr className={className}>
      {children}
    </tr>
  )
}

const DataTableCell = ({ children, className }: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <td className={clsx("px-6 py-5", className!)}>
      {children}
    </td>
  )
}

export { DataTable, DataTableBody, DataTableCell, DataTableHeadCell, DataTableHeader, DataTableRow }