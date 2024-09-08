import { memo } from "react";

const VisibilityControlsBase = ({ visible, setVisible }) => {
  const showAsks = () => setVisible((v) => ({ asks: true, bids: false }));
  const showBids = () => setVisible((v) => ({ asks: false, bids: true }));
  const showAll = () => setVisible((v) => ({ asks: true, bids: true }));

  return (
    <div className="flex justify-start gap-1">
      <button
        className={`
        text-muted-300 dark:text-muted-600 rounded
        ${
          visible.asks && visible.bids
            ? "bg-muted-200 dark:bg-muted-800 text-muted-500 dark:text-muted-300"
            : ""
        }
      `}
        onClick={showAll}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 8.5 h2 v5 h-2 v-5 z" fill="#5EEAD4"></path>
          <path d="M3 2.5 h2 v5 h-2 v-5 z" fill="#F43F5E"></path>
          <path
            d="M6 2.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 5.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 8.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 11.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
        </svg>
      </button>
      <button
        className={`
        text-muted-300 dark:text-muted-600 rounded
        ${
          visible.asks && !visible.bids
            ? "bg-muted-200 dark:bg-muted-800 text-muted-500 dark:text-muted-300"
            : ""
        }
      `}
        onClick={showAsks}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 2.5 h2 v11 h-2 v-5 z" fill="#5EEAD4"></path>
          <path
            d="M6 2.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 5.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 8.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 11.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
        </svg>
      </button>
      <button
        className={`
        text-muted-300 dark:text-muted-600 rounded
        ${
          visible.bids && !visible.asks
            ? "bg-muted-200 dark:bg-muted-800 text-muted-500 dark:text-muted-300"
            : ""
        }
      `}
        onClick={showBids}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M3 2.5 h2 v11 h-2 v-5 z" fill="#F43F5E"></path>
          <path
            d="M6 2.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 5.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 8.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
          <path
            d="M6 11.5 h7 v2 h-7 v-2 z"
            fill="currentColor"
            fillOpacity="0.9"
          ></path>
        </svg>
      </button>
    </div>
  );
};

export const VisibilityControls = memo(VisibilityControlsBase);
