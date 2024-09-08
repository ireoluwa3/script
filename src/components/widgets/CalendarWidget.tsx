import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { cva } from "class-variance-authority";
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
const calendarStyles = cva(
  "mx-auto flex w-full py-2.5 items-center justify-center rounded-lg text-xs transition-colors duration-300",
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
        className: "font-semibold",
      },
      {
        isToday: true,
        className: "font-semibold bg-primary-500/10 text-primary-500",
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
          "text-center hover:bg-muted-200 hover:text-primary-500 dark:hover:bg-muted-800",
      },
      {
        isSelected: false,
        isToday: false,
        isSameMonth: false,
        className: "text-muted-300",
      },
      {
        isSelected: true,
        isToday: false,
        className: "bg-primary-500 text-white",
      },
    ],
  }
);
const CalendarWidget = () => {
  const { t } = useTranslation();
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());
  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  });
  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }
  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center ps-2 text-muted-800 dark:text-muted-100">
          <h3>{format(firstDayCurrentMonth, "MMMM yyyy")}</h3>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={previousMonth}
            className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-all duration-300 dark:text-muted-500"
          >
            <Icon
              icon="lucide:chevron-left"
              className="text-muted-500 transition-colors duration-300"
            />
          </button>
          <button
            onClick={nextMonth}
            className="relative flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-400 transition-all duration-300 dark:text-muted-500"
          >
            <Icon
              icon="lucide:chevron-right"
              className="text-muted-500 transition-colors duration-300"
            />
          </button>
        </div>
      </div>

      <div className="w-full text-xs text-muted-800 dark:text-muted-100">
        <div className=" grid grid-cols-7 text-xs font-semibold uppercase text-muted-500 [&>*]:py-2 [&>*]:text-center">
          <div>{t("Sun")}</div>
          <div>{t("Mon")}</div>
          <div>{t("Tue")}</div>
          <div>{t("Wed")}</div>
          <div>{t("Thu")}</div>
          <div>{t("Fri")}</div>
          <div>{t("Sat")}</div>
        </div>
        <div className="grid grid-cols-7 text-sm gap-[0.2rem]">
          {days.map((day, dayIdx) => (
            <div
              key={day.toString()}
              className={`  ${
                dayIdx === 0 ? colStartClasses[getDay(day)] : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedDay(day)}
                className={calendarStyles({
                  isSelected: isEqual(day, selectedDay),
                  isToday: isToday(day),
                  isSameMonth: isSameMonth(day, firstDayCurrentMonth),
                })}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default CalendarWidget;
