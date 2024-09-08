import { useRef, useState, memo } from "react";
import { motion, useInView } from "framer-motion";
import SupportConversation from "../SupportConversation";
import { formatDate } from "date-fns";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import ReactDOM from "react-dom";

const ImageModal = ({ src, onClose }) => {
  if (!src) return null;

  const portalRoot = document.getElementById("portal-root");

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={onClose}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div
        className="rounded-lg shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevents click inside the modal from closing it
      >
        <MashImage
          src={src}
          alt="Preview"
          className="rounded-lg max-h-[80vh] max-w-[80vw] object-contain"
        />
        <button onClick={onClose} className="absolute top-3 right-3 text-white">
          <Icon icon="eva:close-fill" className="text-2xl" />
        </button>
      </div>
    </div>,
    portalRoot as Element
  );
};

const MessageBase = ({ message, type, userAvatar, agentAvatar, side }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: { y: 0, opacity: 0 },
    visible: {
      y: 30,
      opacity: 1,
      transition: { type: "spring", stiffness: 120, damping: 20 },
    },
  };

  const handleImageClick = (e) => {
    e.preventDefault(); // Prevent default link behavior
    setCurrentImage(message.attachment as string);
    setModalOpen(true);
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {isModalOpen && (
        <ImageModal src={currentImage} onClose={() => setModalOpen(false)} />
      )}
      <SupportConversation
        avatar={type === "client" ? userAvatar : agentAvatar}
        side={side}
        timestamp={formatDate(
          new Date(message.time || Date.now()),
          "MMM dd, yyyy h:mm a"
        )}
      >
        {message.attachment ? (
          <div className="relative group">
            <a onClick={handleImageClick} className="block cursor-pointer">
              <MashImage
                src={message.attachment as string}
                height={100}
                width={100}
                alt="Attachment"
                className="rounded-lg"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                <Icon icon="akar-icons:eye" className="text-white text-3xl" />
              </div>
            </a>
          </div>
        ) : (
          message.text
        )}
      </SupportConversation>
    </motion.div>
  );
};

export const Message = memo(MessageBase);
