import React, { type FC, useEffect, useMemo, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import { Icon, type IconifyIcon } from "@iconify/react";
import { cva } from "class-variance-authority";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isBefore,
  isEqual,
  isSameMonth,
  isToday,
  isValid,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import Input from "@/components/elements/form/input/Input";
import Button from "@/components/elements/base/button/Button";
import { useTranslation } from "next-i18next";
const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const numberRegex = /^-?\d*\.?\d+$/;
const pickerStyles = cva(
  "mx-auto flex w-full py-2 items-center justify-center text-xs ",
  {
    variants: {
      isToday: { true: "", false: "" },
      isSelected: { true: "", false: "" },
      isSameMonth: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      {
        isSelected: true,
        className: "font-medium",
      },
      {
        isToday: true,
        className: "font-medium bg-primary-500 text-white",
      },
      {
        isSelected: true,
        isToday: true,
        className: "bg-primary-500 text-white",
      },
      {
        isSelected: false,
        isToday: false,
        isSameMonth: true,
        className:
          "text-center hover:bg-muted-100 hover:text-primary-500 dark:hover:bg-muted-800 disabled:dark:hover:bg-transparent disabled:text-muted-300 dark:disabled:text-muted-700 disabled:cursor-not-allowed",
      },
      {
        isSelected: false,
        isToday: false,
        isSameMonth: false,
        className:
          "text-muted-300 dark:hover:bg-muted-800 disabled:dark:hover:bg-transparent disabled:cursor-not-allowed",
      },
      {
        isSelected: true,
        isToday: false,
        className: "bg-primary-500 text-white",
      },
    ],
  }
);
interface DatePickerProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "size" | "value"> {
  value: Date;
  valueFormat?: string;
  icon?: IconifyIcon | string;
  label?: string;
  shape?: "straight" | "rounded" | "smooth" | "curved" | "full";
  size?: "sm" | "md" | "lg";
  color?: "default" | "contrast" | "muted" | "mutedContrast";
  placeholder?: string;
  minDate?: Date;
  disabled?: boolean;
  loading?: boolean;
}
const DatePicker: FC<DatePickerProps> = ({
  value,
  valueFormat = "yyyy-MM-dd",
  icon,
  shape = "smooth",
  size = "md",
  color = "default",
  label,
  placeholder,
  minDate,
  disabled,
  loading = false,
  ...props
}) => {
  const { t } = useTranslation();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayInput, setOverlayInput] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(pickerRef, () => setPickerOpen(false));
  const pickerModalRef = useRef<HTMLDivElement>(null);
  useOnClickOutside(pickerModalRef, () => setShowOverlay(false));
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(new Date(value));
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const { onChange } = props;
  useEffect(() => {
    if (isValid(value) && !isEqual(value, selectedDay)) {
      setSelectedDay(value);
    }
  }, [value]);
  useEffect(() => {
    if (onChange) {
      onChange({
        target: {
          value: selectedDay,
        },
      } as any);
    }
  }, [selectedDay]);
  const displayValue = useMemo(
    () => (isValid(selectedDay) ? format(selectedDay, valueFormat) : ""),
    [selectedDay, valueFormat]
  );
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });
  const previousMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };
  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  };
  const handleFocused = () => {
    setPickerOpen(true);
    setTimeout(() => {
      pickerModalRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 100);
  };
  const handleOverlayYear = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if ((value != "" && !numberRegex.test(value)) || value.length > 4) {
      return;
    }
    setOverlayInput(value);
  };
  const handleConfirm = () => {
    const newDate = new Date().setFullYear(+overlayInput);
    setCurrentMonth(format(newDate, "MMM-yyyy"));
    setShowOverlay(false);
  };
  const handleGotoMonth = (month: number) => {
    const year =
      numberRegex.test(overlayInput) && overlayInput.length == 4
        ? +overlayInput
        : today.getFullYear();
    const newDate = new Date().setFullYear(year, month);
    setCurrentMonth(format(newDate, "MMM-yyyy"));
    setShowOverlay(false);
  };
  const isdisabled = (date: Date) => {
    if (minDate) {
      return isBefore(date, minDate);
    }
    return false;
  };
  return (
    <div ref={pickerRef} className="relative w-full font-sans">
      <Input
        type="text"
        label={label}
        shape={shape}
        size={size}
        color={color}
        icon={icon}
        placeholder={placeholder}
        onFocus={handleFocused}
        value={displayValue}
        disabled={disabled}
        loading={loading}
        {...props}
      />
      <div
        ref={pickerModalRef}
        className={`absolute start-0 top-full isolate z-10 mt-2 w-full border border-muted-200 bg-white p-5 shadow-lg shadow-muted-300/30 dark:border-muted-800 dark:bg-muted-950 dark:shadow-muted-800/20 
          ${pickerOpen ? "block" : "hidden"}
          ${shape === "rounded" ? "rounded-md" : ""}     
          ${shape === "smooth" ? "rounded-lg" : ""}    
          ${shape === "curved" ? "rounded-xl" : ""}    
          ${shape === "full" ? "rounded-xl" : ""}   
        `}
      >
        <div className="w-full text-xs text-muted-800 dark:text-muted-100">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={previousMonth}
              className="flex flex-none items-center justify-center p-1.5 text-muted-500 hover:text-muted-400"
            >
              <span className="sr-only">{t("Previous month")}</span>
              <Icon
                icon="lucide:chevron-left"
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => setShowOverlay(true)}
              className="text-sm font-medium text-muted-800 hover:underline dark:text-muted-100"
            >
              {format(firstDayCurrentMonth, "MMMM yyyy")}
            </button>
            <button
              onClick={nextMonth}
              type="button"
              className="text-muted-500 flex flex-none items-center justify-center p-1.5 hover:text-muted-400"
            >
              <span className="sr-only">{t("Next month")}</span>
              <Icon
                icon="lucide:chevron-right"
                className="h-5 w-5"
                aria-hidden="true"
              />
            </button>
          </div>
          <div className="mt-3 grid grid-cols-7">
            {dayLabels.map((dayLabel, index) => (
              <div
                key={index}
                className="py-2 text-center text-[0.52rem] font-normal uppercase text-muted-400"
              >
                {dayLabel}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 text-sm">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={`${
                  dayIdx === 0 ? colStartClasses[getDay(day)] : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDay(day);
                    setPickerOpen(false);
                  }}
                  disabled={isdisabled(day)}
                  className={`${pickerStyles({
                    isSelected: isEqual(day, selectedDay),
                    isToday: isToday(day),
                    isSameMonth: isSameMonth(day, firstDayCurrentMonth),
                  })}
                  ${shape === "rounded" ? "rounded-md" : ""}     
                  ${shape === "smooth" ? "rounded-lg" : ""}    
                  ${shape === "curved" ? "rounded-xl" : ""}    
                  ${shape === "full" ? "rounded-full" : ""} 
                  `}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`absolute inset-0 flex flex-col justify-between rounded-lg bg-white p-5 text-white transition-all duration-300 dark:bg-muted-950 
            ${showOverlay ? "z-[2] opacity-100" : "-z-[1] opacity-0"} 
          `}
        >
          <div>
            <input
              type="text"
              pattern="(^\d{4}$)|(^\d{4}-\d{2}-\d{2}$)"
              placeholder={t("4-digit year")}
              value={overlayInput}
              onChange={handleOverlayYear}
              className="mx-auto block w-4/5 border-b border-muted-200 bg-transparent py-1 text-center text-base text-muted-800 focus:outline-none dark:border-muted-800 dark:text-muted-100"
            />

            <button
              type="button"
              onClick={() => setShowOverlay(false)}
              className="absolute end-2 top-0 p-2 text-2xl opacity-70"
            >
              {t("times")}
            </button>
          </div>

          <div className="grid grid-cols-3">
            {months.map((month, index) => (
              <button
                key={index}
                type="button"
                data-month={index + 1}
                onClick={() => handleGotoMonth(index)}
                className={`
                  py-2 text-sm text-muted-800/70 hover:bg-muted-100 hover:text-muted-800 dark:text-muted-400 dark:hover:bg-muted-800 dark:hover:text-white
                  ${shape === "rounded" ? "rounded-md" : ""}     
                  ${shape === "smooth" ? "rounded-lg" : ""}    
                  ${shape === "curved" ? "rounded-xl" : ""}    
                  ${shape === "full" ? "rounded-full" : ""} 
                `}
              >
                {month}
              </button>
            ))}
          </div>

          <Button
            type="button"
            color="primary"
            shape={shape}
            onClick={handleConfirm}
            disabled={overlayInput.length != 4}
            className="mx-auto !h-auto !px-3 !py-[.28rem]"
          >
            {t("Confirm")}
          </Button>
        </div>
      </div>
    </div>
  );
};
export default DatePicker;
