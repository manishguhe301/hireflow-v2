import DocumentCard from './DocumentCard'

const CompanyDocs = ({
  paths: {
    businessDocPath,
    taxDocPath
  }, companyId }: {
    paths: {
      businessDocPath: string | null,
      taxDocPath: string | null
    }
    companyId: string
  }) => {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Documents</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DocumentCard
          label="Business Registration"
          hasDocument={Boolean(businessDocPath)}
          apiUrl={`/api/company/${companyId}/document?type=business`}
        />
        <DocumentCard
          label="Tax Document"
          hasDocument={Boolean(taxDocPath)}
          apiUrl={`/api/company/${companyId}/document?type=tax`}
        />
      </div>
    </section>
  )
}

export default CompanyDocs