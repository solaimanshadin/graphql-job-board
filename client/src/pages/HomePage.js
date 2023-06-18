import JobList from '../components/JobList';
import { useJobs } from '../hooks/useJobs';

function HomePage() {
  const {jobs, loading} = useJobs()
  if(loading) {
    return <h1>Loading...</h1>
  }
  return (
    <div>
      <h1 className="title">
        Job Board
      </h1>
      <JobList jobs={jobs} />
    </div>
  );
}

export default HomePage;
