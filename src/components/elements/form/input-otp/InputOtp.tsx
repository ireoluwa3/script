import React, { type FC, useMemo } from "react";
import { RE_DIGIT } from "@/utils/strings";

export type InputOtpProps = {
  value: string;
  valueLength: number;
  onChange: (value: string) => void;
  color?: "default" | "contrast" | "muted" | "mutedContrast";
  shape?: "smooth" | "rounded" | "curved" | "full";
};

const InputOtp: FC<InputOtpProps> = ({
  value,
  valueLength,
  color = "default",
  shape = "smooth",
  onChange,
}) => {
  const valueItems = useMemo(() => {
    const valueArray = value.split("");
    const items: Array<string> = [];

    for (let i = 0; i < valueLength; i++) {
      const char = valueArray[i];

      if (RE_DIGIT.test(char)) {
        items.push(char);
      } else {
        items.push("");
      }
    }

    return items;
  }, [value, valueLength]);

  const focusToNextInput = (target: HTMLElement) => {
    const nextElementSibling =
      target.nextElementSibling as HTMLInputElement | null;

    if (nextElementSibling) {
      nextElementSibling.focus();
    }
  };

  const focusToPrevInput = (target: HTMLElement) => {
    const previousElementSibling =
      target.previousElementSibling as HTMLInputElement | null;

    if (previousElementSibling) {
      previousElementSibling.focus();
    }
  };

  const inputOnChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number
  ) => {
    const target = e.target;
    let targetValue = target.value.trim();
    const isTargetValueDigit = RE_DIGIT.test(targetValue);

    if (!isTargetValueDigit && targetValue !== "") {
      return;
    }

    const nextInputEl = target.nextElementSibling as HTMLInputElement | null;

    // only delete digit if next input element has no value
    if (!isTargetValueDigit && nextInputEl && nextInputEl.value !== "") {
      return;
    }

    targetValue = isTargetValueDigit ? targetValue : " ";

    const targetValueLength = targetValue.length;

    if (targetValueLength === 1) {
      const newValue =
        value.substring(0, idx) + targetValue + value.substring(idx + 1);

      onChange(newValue);

      if (!isTargetValueDigit) {
        return;
      }

      focusToNextInput(target);
    } else {
      onChange(targetValue);

      target.blur();
    }
  };

  const inputOnKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;
    const target = e.target as HTMLInputElement;

    if (key === "ArrowRight" || key === "ArrowDown") {
      e.preventDefault();
      return focusToNextInput(target);
    }

    if (key === "ArrowLeft" || key === "ArrowUp") {
      e.preventDefault();
      return focusToPrevInput(target);
    }

    const targetValue = target.value;

    // keep the selection range position
    // if the same digit was typed
    target.setSelectionRange(0, targetValue.length);

    if (e.key !== "Backspace" || target.value !== "") {
      return;
    }

    focusToPrevInput(target);
  };

  const inputOnFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { target } = e;

    // keep focusing back until previous input
    // element has value
    const prevInputEl =
      target.previousElementSibling as HTMLInputElement | null;

    if (prevInputEl && prevInputEl.value === "") {
      return prevInputEl.focus();
    }

    target.setSelectionRange(0, target.value.length);
  };
  return (
    <div className="flex w-full flex-row items-center justify-center gap-3">
      {valueItems.map((digit, idx) => (
        <input
          key={idx}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength={valueLength}
          className={`flex w-16 flex-col items-center justify-center border py-5 text-center text-4xl text-muted-800 outline-none ring-primary-700 placeholder:text-muted-300 focus:ring-1 dark:text-muted-100 dark:placeholder:text-muted-700
          ${
            color === "default"
              ? "hover:border-muted-300 dark:hover:border-muted-600 border-muted-200 bg-white focus:bg-muted-50 dark:border-muted-700 dark:bg-muted-800 dark:focus:bg-muted-900"
              : ""
          }
          ${
            color === "contrast"
              ? "hover:border-muted-300 dark:hover:border-muted-700 bg-white focus:bg-muted-50 dark:border-muted-800 dark:bg-muted-900 dark:focus:bg-muted-900"
              : ""
          }
          ${
            color === "muted"
              ? "hover:border-muted-300 dark:hover:border-muted-600 border-muted-200 bg-muted-100 focus:bg-muted-100 dark:border-muted-700 dark:bg-muted-800 dark:focus:bg-muted-900"
              : ""
          }
          ${
            color === "mutedContrast"
              ? "hover:border-muted-300 dark:hover:border-muted-700 border-muted-200 bg-muted-100 focus:bg-muted-100 dark:border-muted-800 dark:bg-muted-900 dark:focus:bg-muted-900"
              : ""
          }
          ${shape === "rounded" ? "rounded-md" : ""}
          ${shape === "smooth" ? "rounded-lg" : ""}
          ${shape === "curved" ? "rounded-xl" : ""}
          ${shape === "full" ? "rounded-full" : ""}
          `}
          value={digit}
          onChange={(e) => inputOnChange(e, idx)}
          onKeyDown={inputOnKeyDown}
          onFocus={inputOnFocus}
          placeholder="0"
        />
      ))}
    </div>
  );
};

export default InputOtp;
