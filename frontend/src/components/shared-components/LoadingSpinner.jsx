import React from 'react';
import PropTypes from 'prop-types';
import { Activity } from 'lucide-react';

const LoadingSpinner = ({ 
  showProgress = true, 
  messages = [
    'Initializing...',
    'Loading data...',
    'Almost ready...'
  ],
  messageInterval = 400, 
  className = '' 
}) => {
  const [loadingProgress, setLoadingProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState(messages[0]);

  React.useEffect(() => {
    if (showProgress) {
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          if (prev >= 100) return 100;
          return prev + 2;
        });
      }, 40); // Updates every 40ms for smooth animation

      return () => clearInterval(progressInterval);
    }
  }, [showProgress]);

  React.useEffect(() => {
    const textInterval = setInterval(() => {
      setLoadingText(prev => {
        const currentIndex = messages.indexOf(prev);
        return messages[(currentIndex + 1) % messages.length];
      });
    }, messageInterval);

    return () => clearInterval(textInterval);
  }, [messages, messageInterval]);

  return (
    <div className={`min-h-screen bg-slate-900 flex items-center justify-center p-4 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-24 h-24 mx-auto mb-4">
            {/* Rotating Ring */}
            <div className="w-full h-full border-4 border-transparent border-t-orange-500 border-r-orange-500 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Loading Text */}
        <h2 className="text-white text-2xl font-bold mb-2">
          Loading
        </h2>
        
        <p className="text-slate-400 mb-12 h-6 transition-all duration-300">
          {loadingText}
        </p>

        {showProgress && (
          <div className="w-64 mx-auto">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              />
            </div>
            <div className="text-slate-400 text-sm mt-2">
              {loadingProgress}%
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

LoadingSpinner.propTypes = {
  showProgress: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.string),
  messageInterval: PropTypes.number,
  className: PropTypes.string
};

export default LoadingSpinner;
