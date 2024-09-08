import { Icon } from "@iconify/react";
import ReactDOM from "react-dom";

const Portal = ({ children, onClose }) => {
  if (!children) return null;

  const portalRoot = document.getElementById("portal-root");

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div
        className="rounded-lg shadow-lg overflow-hidden relative bg-white dark:bg-muted-800"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-muted-700 dark:text-muted-200"
        >
          <Icon icon="eva:close-fill" className="text-2xl" />
        </button>
      </div>
    </div>,
    portalRoot || document.body
  );
};

export default Portal;
