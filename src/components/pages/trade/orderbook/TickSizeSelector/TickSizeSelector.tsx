import { memo } from "react";

const TickSizeSelectorBase = ({ currentTickSize, setTickSize }) => {
  const tickSizes = [0.01, 0.1, 1, 10]; // Define available tick sizes

  return (
    <div className="flex justify-center gap-2 p-2">
      {tickSizes.map((size) => (
        <button
          key={size}
          onClick={() => setTickSize(size)}
          className={`px-2 py-1 text-sm rounded ${
            currentTickSize === size
              ? "bg-muted-700 text-white"
              : "bg-muted-200"
          }`}
        >
          {size}
        </button>
      ))}
    </div>
  );
};

export const TickSizeSelector = memo(TickSizeSelectorBase);
