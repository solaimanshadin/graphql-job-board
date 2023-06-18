import { useParams } from 'react-router';
import JobList from '../components/JobList';
import { useCompany } from '../hooks/useCompany';


function CompanyPage() {
  const { companyId } = useParams();
  const {company, loading, error} = useCompany(companyId)
  

  if(error) {
    return <h1> Error</h1>
  }
  return (
    <div>
      <h1 className="title">
        {company?.name}
      </h1>
      <div className="box">
        {company?.description}
      </div>
      <h1>Job at {company?.name}</h1>
      <JobList jobs={company?.jobs || []} />
    </div>
  );
}

export default CompanyPage;
