import React, {
  useEffect,
  useRef,
  type FC,
  type TextareaHTMLAttributes,
} from "react";
import type { VariantProps } from "class-variance-authority";
import { textareaVariants } from "@/components/elements/variants/textarea-variants";
import Loader from "@/components/elements/base/loader/Loader";
import { focusClass } from "@/utils/constants";

interface TextAreaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "color">,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
  resize?: boolean;
  loading?: boolean;
  setFirstErrorInputRef?: (ref: HTMLTextAreaElement) => void;
}

const Textarea: FC<TextAreaProps> = ({
  label,
  error,
  color = "default",
  shape = "smooth",
  resize = false,
  loading = false,
  className: classes = "",
  setFirstErrorInputRef,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (setFirstErrorInputRef) {
      setFirstErrorInputRef(textareaRef.current as HTMLTextAreaElement);
    }
  }, [setFirstErrorInputRef, error]);

  return (
    <div className="w-full font-sans">
      {!!label ? <label className="text-sm text-muted-400">{label}</label> : ""}
      <div className="relative w-full text-base">
        <textarea
          ref={textareaRef}
          rows={4}
          className={textareaVariants({
            color,
            shape,
            className: ` 
              ${classes}
              ${!resize ? "resize-none" : ""}
              ${error ? "!border-danger-500" : ""}
              ${
                loading
                  ? "pointer-events-none !text-transparent !shadow-none placeholder:!text-transparent !select-none"
                  : ""
              }
              ${focusClass}
            `,
          })}
          {...props}
        ></textarea>
        {!!loading ? (
          <div
            className={`absolute end-0 top-0 z-0 flex h-10 w-10 items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
          `}
          >
            <Loader
              classNames={`dark:text-muted-200
                ${
                  color === "muted" || color === "mutedContrast"
                    ? "text-muted-400"
                    : "text-muted-300"
                }
              `}
              size={20}
              thickness={4}
            />
          </div>
        ) : (
          ""
        )}
        {!!error ? (
          <span className="-mt-1 block font-sans text-[0.6rem] text-danger-500">
            {error}
          </span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Textarea;
