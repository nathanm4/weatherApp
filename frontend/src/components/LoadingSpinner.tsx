import { Loader2 } from 'lucide-react';
import './LoadingSpinner.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-container">
      <Loader2 size={48} className="loading-spinner" />
      <p>Loading weather data...</p>
    </div>
  );
};

export default LoadingSpinner;
