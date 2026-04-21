import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <AlertCircle size={48} className="text-text-muted mb-4" />
      <p className="text-text-secondary text-sm mb-4">{message || "Something went wrong"}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-surface-lighter rounded-full text-sm text-white hover:bg-surface-hover transition-colors"
        >
          <RefreshCw size={14} /> Try again
        </button>
      )}
    </div>
  );
}
