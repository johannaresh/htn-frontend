import { Button } from './Button';

interface SuccessStateProps {
  message: string;
  onClose: () => void;
}

export const SuccessState = ({ message, onClose }: SuccessStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {/* Large green check icon */}
      <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
        <svg
          className="w-12 h-12 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* Thank you message */}
      <p className="text-lg text-white mb-8">{message}</p>

      {/* Close button */}
      <Button variant="primary" onClick={onClose}>
        Close
      </Button>
    </div>
  );
};
