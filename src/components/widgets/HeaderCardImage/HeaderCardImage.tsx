import { memo, ReactNode } from "react";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { Lottie } from "@/components/elements/base/lottie";
import { LottieProps } from "@/components/elements/base/lottie/Lottie.types";

const HeaderCardImageBase = ({
  title,
  description,
  link,
  linkLabel,
  linkElement,
  lottie,
  imgSrc,
  size,
}: {
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
  linkElement?: ReactNode;
  lottie?: LottieProps;
  imgSrc?: string;
  size: "sm" | "md" | "lg";
}) => {
  return (
    <div
      className={`relative rounded-xl bg-gradient-to-r from-muted-700 to-muted-950 dark:from-primary-700 dark:to-primary-950 p-6
        mt-6`}
    >
      <div className="flex h-full items-stretch overflow-hidden rounded-3xl">
        <div className="w-full p-8 md:p-10 md:pe-0 md:w-3/5">
          <h2 className="mb-2 font-sans text-2xl font-medium leading-tight text-white">
            {title}
          </h2>
          <p className="md:max-w-sm ltablet:max-w-xs text-md leading-tight text-muted-100/80">
            {description}
          </p>
          <div className="mt-5 flex justify-start gap-2">
            {link && (
              <Link
                href={link}
                className="relative inline-flex h-12 w-full md:w-auto cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-center text-[.9rem] font-medium text-white transition-all duration-300 after:absolute after:start-0 after:top-0 after:h-full after:w-full after:rounded-lg after:bg-muted-100 after:opacity-20 after:transition-opacity after:duration-300 after:content-[''] hover:after:opacity-30 hover:translate-x-1"
              >
                <span>{linkLabel}</span>

                <Icon icon="lucide:arrow-right" className="h-4 w-4" />
              </Link>
            )}
            {linkElement}
          </div>
        </div>
      </div>
      {imgSrc ? (
        <MashImage
          className={`absolute bottom-5 end-[-65px] hidden md:block w-full max-w-xs ${
            size === "md" &&
            (link ? "md:max-w-80 lg:max-w-96" : "md:max-w-72 lg:max-w-80")
          } ${size === "lg" && (link ? "lg:max-w-[320px]" : "md:max-w-80")}
           md:-end-8`}
          width={170}
          height={250}
          src={imgSrc}
          alt="Header image"
        />
      ) : lottie ? (
        <div
          className={`absolute bottom-0 end-[-65px] hidden md:block w-full max-w-xs ${
            size === "md" &&
            (link ? "md:max-w-80 lg:max-w-96" : "md:max-w-72 lg:max-w-80")
          } ${size === "lg" && (link ? "lg:max-w-[320px]" : "md:max-w-80")}
     md:-end-4`}
        >
          <Lottie
            category={lottie.category}
            path={lottie.path}
            max={lottie.max}
            height={lottie.height}
            width={lottie.width}
          />
        </div>
      ) : null}
    </div>
  );
};

export const HeaderCardImage = memo(HeaderCardImageBase);
