import { useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { useJob } from '../hooks/useJob';
import { formatDate } from '../lib/formatters';

function JobPage() {
  const { jobId } = useParams();

  const {job, loading, error} = useJob(jobId)
  if(loading) {
    return <h1> Loading ... </h1>
  }
  return (
    <div>
      <h1 className="title is-2">
        {job.title}
      </h1>
      <h2 className="subtitle is-4">
        <Link to={`/companies/${job?.company?.id}`}>
          {job.company?.name}
        </Link>
      </h2>
      <div className="box">
        <div className="block has-text-grey">
          Posted: {job.date && formatDate(job?.date, 'long')}
        </div>
        <p className="block">
          {job.description}
        </p>
      </div>
    </div>
  );
}

export default JobPage;
