import React, {
  type InputHTMLAttributes,
  type FC,
  Fragment,
  useState,
  useRef,
  useEffect,
} from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
  Transition,
} from "@headlessui/react";
import type { VariantProps } from "class-variance-authority";
import { inputVariants } from "@/components/elements/variants/input-variants";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Loader from "@/components/elements/base/loader/Loader";
import { useTranslation } from "next-i18next";

interface ComboBoxItem {
  value: any;
  label: string;
  icon?: IconifyIcon | string;
  image?: string;
}

interface ComboBoxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size" | "color">,
    VariantProps<typeof inputVariants> {
  label?: string;
  multiple?: boolean;
  error?: string;
  value?: any;
  selected: any;
  setSelected: any;
  disabled?: boolean;
  loading?: boolean;
  options?: ComboBoxItem[];
  classNames?: string;
  onChange?: (value: any) => void;
  onClose?: () => void;
  setFirstErrorInputRef?: (ref: HTMLInputElement) => void;
}

const ComboBox: FC<ComboBoxProps> = ({
  selected,
  setSelected,
  label,
  size = "md",
  color = "default",
  shape = "smooth",
  disabled,
  loading = false,
  options = [],
  classNames,
  error,
  onClose,
  setFirstErrorInputRef,
  ...props
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        if (onClose) {
          onClose();
        }
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [onClose]);

  useEffect(() => {
    if (setFirstErrorInputRef) {
      setFirstErrorInputRef(selectRef.current as unknown as HTMLInputElement);
    }
  }, [setFirstErrorInputRef, error]);

  const [query, setQuery] = useState("");
  const filteredItems =
    query === ""
      ? options
      : options.filter((item) =>
          item.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <div className={`relative w-full ${classNames}`}>
      <Combobox value={selected ?? ""} onChange={setSelected} ref={inputRef}>
        <div className="relative mt-1">
          {!!label && (
            <label className="font-sans text-[0.68rem] text-muted-400">
              {label}
            </label>
          )}
          <div className="relative w-full font-sans z-20">
            <ComboboxInput
              className={inputVariants({
                size,
                color,
                shape,
                className: `peer relative text-start
                ${size === "sm" && selected?.icon ? "pe-2 ps-8" : ""}
                ${size === "md" && selected?.icon ? "pe-3 ps-10" : ""}
                ${size === "lg" && selected?.icon ? "pe-4 ps-12" : ""}
                ${size === "sm" && selected?.image ? "pe-2 ps-8" : ""}
                ${size === "md" && selected?.image ? "pe-3 ps-11" : ""}
                ${size === "lg" && selected?.image ? "pe-4 ps-12" : ""}
                ${size === "sm" && !selected?.icon ? "px-2" : ""}
                ${size === "md" && !selected?.icon ? "px-3" : ""}
                ${size === "lg" && !selected?.icon ? "px-4" : ""}
                ${size === "sm" && !selected?.image ? "px-2" : ""}
                ${size === "md" && !selected?.image ? "px-3" : ""}
                ${size === "lg" && !selected?.image ? "px-4" : ""}
                ${error ? "!border-danger-500" : ""}
                ${
                  disabled
                    ? "!pointer-events-none !cursor-not-allowed !opacity-50"
                    : ""
                }
                ${
                  loading
                    ? "pointer-events-none !text-transparent !shadow-none placeholder:!text-transparent !select-none"
                    : ""
                }
              `,
              })}
              displayValue={(item: any) => {
                return item && typeof item === "object" && item.label
                  ? item.label
                  : item;
              }}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              {...props}
            />
            <div
              className={`absolute start-0 top-0 z-0flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}`}
            >
              {!!selected?.icon && !selected?.image ? (
                <Icon
                  icon={selected?.icon}
                  className={`
                    ${size === "sm" ? "h-3 w-3" : ""} 
                    ${size === "md" ? "h-4 w-4" : ""} 
                    ${size === "lg" ? "h-5 w-5" : ""}
                    ${error ? "!text-danger-500" : ""}
                  `}
                />
              ) : (
                ""
              )}
              {!!selected?.image && !selected?.icon ? (
                <Avatar
                  src={selected?.image}
                  text={selected?.label.substring(0, 1)}
                  size={size === "lg" ? "xxs" : "xxxs"}
                />
              ) : (
                ""
              )}
            </div>
            {!!loading ? (
              <div
                className={`absolute end-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
                  ${size === "sm" ? "h-8 w-8" : ""} 
                  ${size === "md" ? "h-10 w-10" : ""} 
                  ${size === "lg" ? "h-12 w-12" : ""}`}
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
            <ComboboxButton
              className={`peer:focus-visible:[&>svg]:rotate-180 absolute end-0 top-0 flex items-center justify-center
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}
                ${
                  loading
                    ? "!pointer-events-none !text-transparent !opacity-0 !select-none"
                    : ""
                }
              `}
            >
              <Icon
                icon="lucide:chevrons-up-down"
                className="h-4 w-4 text-muted-400 transition-transform duration-300"
                aria-hidden="true"
              />
            </ComboboxButton>
          </div>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions
              className={`max-h-[300px] slimscroll absolute z-30 mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-none dark:shadow-muted-800/20 sm:text-sm
                ${shape === "rounded" ? "rounded-md" : ""}
                ${shape === "smooth" ? "rounded-lg" : ""}
                ${shape === "rounded" ? "rounded-md" : ""}
                ${shape === "curved" ? "rounded-xl" : ""}
                ${shape === "full" ? "rounded-xl" : ""}
                ${
                  color === "default"
                    ? "border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800"
                    : ""
                }
                ${
                  color === "contrast"
                    ? "border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950"
                    : ""
                }
                ${
                  color === "muted"
                    ? "border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800"
                    : ""
                }
                ${
                  color === "mutedContrast"
                    ? "border-muted-200 bg-white dark:border-muted-800 dark:bg-muted-950"
                    : ""
                }
              `}
              ref={selectRef}
            >
              {filteredItems.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  {t("Nothing found.")}
                </div>
              ) : (
                filteredItems.map((item) => (
                  <ComboboxOption
                    key={item.value}
                    className={({
                      active,
                    }) => `relative flex cursor-default select-none items-center gap-2 p-2 transition-colors duration-300 
                      ${
                        active
                          ? "bg-primary-500/10 text-primary-700 dark:bg-primary-500/20"
                          : "text-muted-600 dark:text-muted-400"
                      }
                      ${shape === "rounded" ? "rounded-md" : ""}
                      ${shape === "smooth" ? "rounded-lg" : ""}
                      ${shape === "rounded" ? "rounded-md" : ""}
                      ${shape === "curved" ? "rounded-xl" : ""}
                      ${shape === "full" ? "rounded-xl" : ""}
                    `}
                    value={item.value}
                  >
                    {({ selected, active }) => (
                      <>
                        {!!item?.icon && !item?.image ? (
                          <span
                            className={`pointer-events-none flex items-center justify-center`}
                          >
                            <Icon
                              icon={item?.icon}
                              className="h-5 w-5 text-muted-400 transition-colors duration-300"
                              aria-hidden="true"
                            />
                          </span>
                        ) : (
                          ""
                        )}
                        {!!item?.image && !item?.icon ? (
                          <Avatar
                            src={item?.image}
                            text={item?.label.substring(0, 1)}
                            size="xxs"
                          />
                        ) : (
                          ""
                        )}
                        <span
                          className={`block truncate
                           ${selected ? "font-medium" : "font-normal"}`}
                        >
                          {item.label}
                        </span>
                        {selected ? (
                          <span
                            className={`relative z-0 ms-auto flex items-center pe-2 text-primary-600 ${
                              active ? "" : ""
                            }`}
                          >
                            <Icon
                              icon="lucide:check"
                              className="h-4 w-4"
                              aria-hidden="true"
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
    </div>
  );
};

export default ComboBox;
