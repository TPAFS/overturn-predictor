import React from "react";

const ModelLoader = ({ progress, isIndeterminate = false }) => {
  return (
    <div className="w-full max-w-lg mx-auto bg-gray-800 text-white-100 p-4 border-gray-900 rounded border-2">
      <div className="mb-2 flex justify-between">
        <span className="text-slate-400 text-sm">
          {isIndeterminate ? "Downloading model..." : "Downloading model..."}
        </span>
        {!isIndeterminate && (
          <span className="text-slate-400 text-sm">{progress}%</span>
        )}
      </div>

      {isIndeterminate ? (
        // Indeterminate progress bar (animated)
        <div className="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-blue-500 h-2.5 rounded-full animate-pulse w-full"
            style={{
              animation: "indeterminateAnimation 1.5s infinite ease-in-out",
              background:
                "linear-gradient(90deg, rgba(59, 130, 246, 0) 0%, rgba(59, 130, 246, 1) 50%, rgba(59, 130, 246, 0) 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        </div>
      ) : (
        // Determinate progress bar
        <div className="w-full bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <p className="text-xs text-slate-500 mt-2">
        {isIndeterminate
          ? "Downloading model... This may take a few moments depending on your connection speed."
          : "This may take a few moments depending on your connection speed"}
      </p>
    </div>
  );
};

export default ModelLoader;
