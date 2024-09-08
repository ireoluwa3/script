import { memo, useCallback, useEffect, useRef, useState } from "react";
import Textarea from "@/components/elements/form/textarea/Textarea";
import { Icon } from "@iconify/react";
import { AnimatePresence } from "framer-motion";
import { Message } from "../support/Message";
import Card from "@/components/elements/base/card/Card";
import IconButton from "@/components/elements/base/button-icon/IconButton";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
const ChatBase = ({
  messages,
  handleFileUpload,
  messageSide,
  user1,
  user2,
  reply,
  isReplying,
  canReply,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [containerWidth, setContainerWidth] = useState(0);
  const [showScrollToBottomButton, setShowScrollToBottomButton] =
    useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  function handleTextareaFocus() {
    setExpanded(true);
  }
  function handleTextareaBlur(e) {
    const currentTarget = e.currentTarget; // Capture the current target at the time of the event.
    setTimeout(() => {
      // Ensure the current target still exists and check if it should still collapse
      if (currentTarget && !currentTarget.contains(document.activeElement)) {
        setExpanded(false);
      }
    }, 150); // A small delay to allow other event handlers to process
  }
  const onClickSend = () => {
    if (message) {
      reply(message);
      setMessage("");
      setExpanded(false); // Close the textarea explicitly here if you still want it to close after sending
    }
  };
  const scrollToBottom = () => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };
  const startFromBottom = () => {
    setTimeout(() => {
      if (messageContainerRef.current) {
        messageContainerRef.current.scrollTop =
          messageContainerRef.current.scrollHeight;
      }
    }, 100);
  };
  useEffect(() => {
    startFromBottom();
  }, [messages]);
  useEffect(() => {
    if (messages.length) {
      startFromBottom(); // Scroll to bottom every time messages update
    }
  }, [messages]);
  const handleScroll = () => {
    const container = messageContainerRef.current;
    if (!container) return;
    const tolerance = 1; // Adjust this tolerance as needed for pixel perfection
    const isAtBottom =
      Math.abs(
        container.scrollHeight - container.scrollTop - container.clientHeight
      ) <= tolerance;
    setShowScrollToBottomButton(!isAtBottom && hasMore);
  };
  const debouncedHandleScroll = useCallback(debounce(handleScroll, 100), [
    hasMore,
  ]);
  useEffect(() => {
    const container = messageContainerRef.current;
    container?.addEventListener("scroll", debouncedHandleScroll);
    return () =>
      container?.removeEventListener("scroll", debouncedHandleScroll);
  }, [debouncedHandleScroll]);
  useEffect(() => {
    const updateWidth = () => {
      if (messageContainerRef.current) {
        setContainerWidth(messageContainerRef.current?.offsetWidth - 2);
      }
    };
    updateWidth(); // Update on mount
    window.addEventListener("resize", updateWidth); // Update on window resize
    return () => {
      window.removeEventListener("resize", updateWidth); // Cleanup on unmount
    };
  }, []);
  return (
    <>
      <div
        className={`gap-5 card relative max-h-[calc(100vh-142px)] h-full mb-5 md:mb-0 ${
          canReply ? "pb-20" : "pb-0"
        }`}
      >
        <div
          ref={messageContainerRef}
          className={`mx-auto flex max-w-full flex-col overflow-y-auto h-full pb-8 px-4 gap-4`}
        >
          <AnimatePresence>
            {messages.map((message, index) => (
              <Message
                key={message.id || index}
                message={message}
                side={messageSide(message.type)}
                type={message.type}
                userAvatar={user1?.avatar || "/img/avatars/placeholder.webp"}
                agentAvatar={user2?.avatar || "/img/avatars/placeholder.webp"}
              />
            ))}
          </AnimatePresence>
        </div>

        {canReply && (
          <div
            className="absolute bottom-4 w-full z-10 px-4"
            style={{ width: `${containerWidth}px` }}
          >
            {showScrollToBottomButton && (
              <div className="w-full flex justify-center">
                <IconButton
                  color="muted"
                  variant="solid"
                  shape="full"
                  size="sm"
                  className="mb-2"
                  onClick={() => scrollToBottom()}
                >
                  <Icon icon="mdi:chevron-down" className="h-5 w-5" />
                </IconButton>
              </div>
            )}
            <Card className="flex items-stretch">
              <div className="relative w-full transition-all duration-300">
                <Textarea
                  id="compose-reply"
                  className={`!border-none !border-transparent !bg-transparent !leading-8 !shadow-none transition-all duration-300 ${
                    expanded ? "h-[175px]" : "h-12 overflow-hidden !resize-none"
                  }`}
                  rows={4}
                  placeholder={t("Write a message...")}
                  onFocus={handleTextareaFocus}
                  onBlur={handleTextareaBlur}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="flex gap-2 items-center justify-end absolute z-5 end-2 top-2 overflow-hidden">
                  <IconButton
                    color={"info"}
                    variant="pastel"
                    shape="rounded"
                    disabled={isReplying}
                  >
                    <input
                      id="upload-attachments"
                      className="absolute start-0 top-0 z-[1] h-full w-full opacity-0"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e.target.files?.[0])}
                    />
                    <Icon
                      icon="material-symbols-light:upload"
                      className="relative h-6 w-6 p-0"
                    />
                  </IconButton>
                  <IconButton
                    color={message ? "primary" : "muted"}
                    variant="pastel"
                    shape="rounded"
                    disabled={!message || isReplying}
                    onClick={onClickSend}
                  >
                    <Icon
                      icon="fluent:send-24-filled"
                      className="relative -end-0.5 h-5 w-5 p-0"
                    />
                  </IconButton>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};
export const Chat = memo(ChatBase);
