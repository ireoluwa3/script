import React, {
  type ButtonHTMLAttributes,
  type FC,
  Fragment,
  useRef,
  useEffect,
} from "react";
import { Icon, type IconifyIcon } from "@iconify/react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import type { VariantProps } from "class-variance-authority";
import { inputVariants } from "@/components/elements/variants/input-variants";
import Avatar from "@/components/elements/base/avatar/Avatar";
import Loader from "@/components/elements/base/loader/Loader";
import { MashImage } from "@/components/elements/MashImage";

interface ListboxItem {
  label: string;
  value: any;
  icon?: IconifyIcon | string;
  image?: string;
}

interface ListboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "size" | "color">,
    VariantProps<typeof inputVariants> {
  label?: string;
  multiple?: boolean;
  error?: string;
  selected?: any;
  setSelected?: any;
  onClose?: () => void;
  setFirstErrorInputRef?: (ref: HTMLInputElement) => void;
  disabled?: boolean;
  options?: ListboxItem[];
  classNames?: string;
  loading?: boolean;
  placeholder?: string;
}

const ListBox: FC<ListboxProps> = ({
  setSelected,
  onClose,
  setFirstErrorInputRef,
  label,
  multiple,
  selected = multiple ? [] : null,
  size = "md",
  color = "default",
  shape = "smooth",
  disabled,
  options = [],
  classNames,
  loading = false,
  error,
  placeholder,
  ...props
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const selectRef = useRef<HTMLSelectElement>(null);

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

  // set selected options on load
  useEffect(() => {
    if (multiple && selected && selected.length > 0) {
      const newSelected = options.filter((option) =>
        selected.some((sel) => sel.value === option.value)
      );
      setSelected(newSelected);
    }
  }, []);

  return (
    <div className={`relative w-full ${classNames} h-full`}>
      <Listbox
        value={selected}
        onChange={(e) => setSelected(e)}
        ref={inputRef}
        multiple={multiple}
      >
        <div className="relative w-full font-sans h-full">
          {!!label && (
            <label className="font-sans text-[0.544rem] text-muted-400 dark:text-muted-500">
              {label}
            </label>
          )}
          <ListboxButton
            className={inputVariants({
              size,
              color,
              shape,
              className: `group/listbox-button relative text-start
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
                  ? "!text-transparent !pointer-events-none !select-none"
                  : ""
              }
            `,
            })}
            {...props}
          >
            <span className="block truncate">
              {multiple && selected?.length > 0
                ? selected.length > 2
                  ? `${selected.length} items`
                  : selected.map((item) => item.label).join(", ")
                : selected?.label || placeholder || "Select an option"}
            </span>

            <div
              className={`absolute start-0 top-0 z-0 flex items-center justify-center text-muted-400 transition-colors duration-300 peer-focus-visible:text-primary-500 dark:text-muted-500 
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
                <MashImage
                  src={selected?.image}
                  alt={selected?.label}
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
            <span
              className={`pointer-events-none absolute end-0 top-0 flex items-center justify-center
                ${size === "sm" ? "h-8 w-8" : ""} 
                ${size === "md" ? "h-10 w-10" : ""} 
                ${size === "lg" ? "h-12 w-12" : ""}
                ${loading ? "!text-transparent !opacity-0" : ""}
              `}
            >
              <Icon
                icon="lucide:chevrons-up-down"
                className="h-4 w-4 text-muted-400 transition-transform duration-300 group-focus/listbox-button:rotate-180"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              ref={selectRef}
              className={`z-[9999] max-h-[300px] slimscroll absolute mt-1 w-full overflow-auto border !p-2 text-base shadow-lg shadow-muted-300/30 ring-1 ring-primary-500 ring-opacity-5 focus:outline-none dark:shadow-muted-800/20 sm:text-sm
                ${selected?.image ? "max-h-[201.2px]" : "max-h-60"}
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
            >
              {options.map((item) => (
                <ListboxOption
                  key={item.value}
                  className={({ active }) =>
                    `relative flex cursor-default select-none items-center gap-2 p-2 transition-colors duration-300
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
                  `
                  }
                  value={item}
                >
                  {({ selected: isSelected }) => (
                    <>
                      {multiple && (
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4"
                          checked={selected.some((s) => s.value === item.value)}
                          onChange={() => {
                            if (selected.some((s) => s.value === item.value)) {
                              setSelected(
                                selected.filter((s) => s.value !== item.value)
                              );
                            } else {
                              setSelected([...selected, item]);
                            }
                          }}
                        />
                      )}
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
                        className={`block truncate ${
                          isSelected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {item.label}
                      </span>
                      {isSelected ? (
                        <span className="relative z-0 ms-auto flex items-center pe-2 text-primary-600">
                          <Icon
                            icon="lucide:check"
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default ListBox;
