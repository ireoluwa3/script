"use client";
import React, { useEffect, useRef, useState } from "react";
import { MotionValue, motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/utils/cn";
import { MashImage } from "@/components/elements/MashImage";
import { Icon } from "@iconify/react";
import { useTranslation } from "next-i18next";
export const MacbookScroll = ({
  src,
  showGradient,
  title,
  badge,
}: {
  src?: string;
  showGradient?: boolean;
  title?: string | React.ReactNode;
  badge?: React.ReactNode;
}) => {
  const { t } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    if (window && window.innerWidth < 768) {
      setIsMobile(true);
    }
  }, []);
  const scaleX = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1.2, isMobile ? 1 : 1.5]
  );
  const scaleY = useTransform(
    scrollYProgress,
    [0, 0.3],
    [0.6, isMobile ? 1 : 1.5]
  );
  const translate = useTransform(scrollYProgress, [0, 1], [0, 1500]);
  const rotate = useTransform(scrollYProgress, [0.1, 0.12, 0.3], [-28, -28, 0]);
  const textTransform = useTransform(scrollYProgress, [0, 0.3], [0, 100]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  return (
    <div
      ref={ref}
      className="min-h-[100vh] md:min-h-[175vh] flex flex-col items-center py-0 md:pt-48 md:pb-20 justify-start flex-shrink-0 [perspective:640px] transform md:scale-100 scale-[0.55] sm:scale-50"
    >
      <motion.h2
        style={{
          translateY: textTransform,
          opacity: textOpacity,
        }}
        className="dark:text-white text-neutral-800 text-3xl font-bold mb-20 text-center"
      >
        {title || (
          <span>
            {t("This Macbook is built with Tailwindcss.")}
            <br />
            {t("No kidding.")}
          </span>
        )}
      </motion.h2>
      {/* Lid */}
      <Lid
        src={src}
        scaleX={scaleX}
        scaleY={scaleY}
        rotate={rotate}
        translate={translate}
      />
      {/* Base area */}
      <div className="h-[17.6rem] w-[25.6rem] bg-gray-200 dark:bg-[#272729] rounded-2xl overflow-hidden relative -z-10">
        {/* above keyboard bar */}
        <div className="h-10 w-full relative">
          <div className="absolute inset-x-0 mx-auto w-[80%] h-4 bg-[#050505]" />
        </div>
        <div className="flex relative">
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <SpeakerGrid />
          </div>
          <div className="mx-auto w-[80%] h-full">
            <Keypad />
          </div>
          <div className="mx-auto w-[10%] overflow-hidden  h-full">
            <SpeakerGrid />
          </div>
        </div>
        <Trackpad />
        <div className="h-2 w-20 mx-auto inset-x-0 absolute bottom-0 bg-gradient-to-t from-[#272729] to-[#050505] rounded-tr-3xl rounded-tl-xl" />
        {showGradient && (
          <div className="h-40 w-full absolute bottom-0 inset-x-0 bg-gradient-to-t dark:from-black from-white via-white dark:via-black to-transparent z-50"></div>
        )}
        {badge && <div className="absolute bottom-4 left-4">{badge}</div>}
      </div>
    </div>
  );
};
export const Lid = ({
  scaleX,
  scaleY,
  rotate,
  translate,
  src,
}: {
  scaleX: MotionValue<number>;
  scaleY: MotionValue<number>;
  rotate: MotionValue<number>;
  translate: MotionValue<number>;
  src?: string;
}) => {
  return (
    <div className="relative [perspective:640px]">
      <div
        style={{
          transform: "perspective(640px) rotateX(-25deg) translateZ(0px)",
          transformOrigin: "bottom",
          transformStyle: "preserve-3d",
        }}
        className="h-[9.6rem] w-[25.6rem] bg-gray-950 dark:bg-muted-900 rounded-2xl p-2 relative"
      ></div>
      <motion.div
        style={{
          scaleX: scaleX,
          scaleY: scaleY,
          rotateX: rotate,
          translateY: translate,
          transformStyle: "preserve-3d",
          transformOrigin: "top",
        }}
        className="h-[17.6rem] w-[25.6rem] absolute inset-0 bg-gray-950 dark:bg-muted-900 rounded-2xl p-2"
      >
        <div className="absolute inset-0 bg-[#272729] rounded-lg" />
        <MashImage
          src={src as string}
          alt="aceternity logo"
          fill
          className="object-cover object-left-top absolute rounded-lg inset-0 h-full w-full"
        />
      </motion.div>
    </div>
  );
};
export const Trackpad = () => {
  return (
    <div
      className="w-[32%] mx-auto h-[5.12rem]  rounded-xl my-1"
      style={{
        boxShadow: "0px 0px 1px 1px #00000020 inset",
      }}
    ></div>
  );
};
export const Keypad = () => {
  const { t } = useTranslation();
  return (
    <div className="h-full rounded-md bg-[#050505] mx-1 p-1">
      {/* First Row */}
      <Row>
        <KBtn
          className="w-10 items-end justify-start pl-[3.2px] pb-[1.8px]"
          childrenClassName="items-start"
        >
          {t("esc")}
        </KBtn>
        <KBtn>
          <Icon icon="tabler:sun-low" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F1</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:sun" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F2</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:table" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F3</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:search" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F4</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:microphone" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F5</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:moon" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F6</span>
        </KBtn>

        <KBtn>
          <Icon
            icon="tabler:player-track-prev"
            className="h-[4.8px] w-[4.8px]"
          />
          <span className="inline-block mt-1">F7</span>
        </KBtn>

        <KBtn>
          <Icon
            icon="tabler:player-skip-forward"
            className="h-[4.8px] w-[4.8px]"
          />
          <span className="inline-block mt-1">F8</span>
        </KBtn>

        <KBtn>
          <Icon
            icon="tabler:player-track-next"
            className="h-[4.8px] w-[4.8px]"
          />
          <span className="inline-block mt-1">F8</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:volume-3" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F10</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:volume-2" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F11</span>
        </KBtn>

        <KBtn>
          <Icon icon="tabler:volume" className="h-[4.8px] w-[4.8px]" />
          <span className="inline-block mt-1">F12</span>
        </KBtn>
        <KBtn>
          <div className="h-4 w-4 rounded-full  bg-gradient-to-b from-20% from-neutral-900 via-black via-50% to-neutral-900 to-95% p-px">
            <div className="bg-black h-full w-full rounded-full" />
          </div>
        </KBtn>
      </Row>

      {/* Second row */}
      <Row>
        <KBtn>
          <span className="block">~</span>
          <span className="block mt-1">`</span>
        </KBtn>

        <KBtn>
          <span className="block ">!</span>
          <span className="block">1</span>
        </KBtn>
        <KBtn>
          <span className="block">@</span>
          <span className="block">2</span>
        </KBtn>
        <KBtn>
          <span className="block">#</span>
          <span className="block">3</span>
        </KBtn>
        <KBtn>
          <span className="block">$</span>
          <span className="block">4</span>
        </KBtn>
        <KBtn>
          <span className="block">%</span>
          <span className="block">5</span>
        </KBtn>
        <KBtn>
          <span className="block">^</span>
          <span className="block">6</span>
        </KBtn>
        <KBtn>
          <span className="block">&</span>
          <span className="block">7</span>
        </KBtn>
        <KBtn>
          <span className="block">*</span>
          <span className="block">8</span>
        </KBtn>
        <KBtn>
          <span className="block">(</span>
          <span className="block">9</span>
        </KBtn>
        <KBtn>
          <span className="block">)</span>
          <span className="block">0</span>
        </KBtn>
        <KBtn>
          <span className="block">-</span>
          <span className="block">_</span>
        </KBtn>
        <KBtn>
          <span className="block">+</span>
          <span className="block"> = </span>
        </KBtn>
        <KBtn
          className="w-10 items-end justify-end pr-[3.2px] pb-[1.8px]"
          childrenClassName="items-end"
        >
          {t("delete")}
        </KBtn>
      </Row>

      {/* Third row */}
      <Row>
        <KBtn
          className="w-10 items-end justify-start pl-[3.2px] pb-[1.8px]"
          childrenClassName="items-start"
        >
          {t("tab")}
        </KBtn>
        <KBtn>
          <span className="block">Q</span>
        </KBtn>

        <KBtn>
          <span className="block">W</span>
        </KBtn>
        <KBtn>
          <span className="block">E</span>
        </KBtn>
        <KBtn>
          <span className="block">R</span>
        </KBtn>
        <KBtn>
          <span className="block">T</span>
        </KBtn>
        <KBtn>
          <span className="block">Y</span>
        </KBtn>
        <KBtn>
          <span className="block">U</span>
        </KBtn>
        <KBtn>
          <span className="block">I</span>
        </KBtn>
        <KBtn>
          <span className="block">O</span>
        </KBtn>
        <KBtn>
          <span className="block">P</span>
        </KBtn>
        <KBtn>
          <span className="block">{`{`}</span>
          <span className="block">{`[`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`}`}</span>
          <span className="block">{`]`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`|`}</span>
          <span className="block">{`\\`}</span>
        </KBtn>
      </Row>

      {/* Fourth Row */}
      <Row>
        <KBtn
          className="w-[2.24rem] items-end justify-start pl-[3.2px] pb-[1.8px]"
          childrenClassName="items-start"
        >
          {t("caps lock")}
        </KBtn>
        <KBtn>
          <span className="block">A</span>
        </KBtn>

        <KBtn>
          <span className="block">S</span>
        </KBtn>
        <KBtn>
          <span className="block">D</span>
        </KBtn>
        <KBtn>
          <span className="block">F</span>
        </KBtn>
        <KBtn>
          <span className="block">G</span>
        </KBtn>
        <KBtn>
          <span className="block">H</span>
        </KBtn>
        <KBtn>
          <span className="block">J</span>
        </KBtn>
        <KBtn>
          <span className="block">K</span>
        </KBtn>
        <KBtn>
          <span className="block">L</span>
        </KBtn>
        <KBtn>
          <span className="block">{`:`}</span>
          <span className="block">{`;`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`"`}</span>
          <span className="block">{`'`}</span>
        </KBtn>
        <KBtn
          className="w-[2.28rem] items-end justify-end pr-[3.2px] pb-[1.8px]"
          childrenClassName="items-end"
        >
          {t("return")}
        </KBtn>
      </Row>

      {/* Fifth Row */}
      <Row>
        <KBtn
          className="w-[2.92rem] items-end justify-start pl-[3.2px] pb-[1.8px]"
          childrenClassName="items-start"
        >
          {t("shift")}
        </KBtn>
        <KBtn>
          <span className="block">Z</span>
        </KBtn>
        <KBtn>
          <span className="block">X</span>
        </KBtn>
        <KBtn>
          <span className="block">C</span>
        </KBtn>
        <KBtn>
          <span className="block">V</span>
        </KBtn>
        <KBtn>
          <span className="block">B</span>
        </KBtn>
        <KBtn>
          <span className="block">N</span>
        </KBtn>
        <KBtn>
          <span className="block">M</span>
        </KBtn>
        <KBtn>
          <span className="block">{`<`}</span>
          <span className="block">{`,`}</span>
        </KBtn>
        <KBtn>
          <span className="block">{`>`}</span>
          <span className="block">{`.`}</span>
        </KBtn>{" "}
        <KBtn>
          <span className="block">{`?`}</span>
          <span className="block">{`/`}</span>
        </KBtn>
        <KBtn
          className="w-[2.92rem] items-end justify-end pr-[3.2px] pb-[1.8px]"
          childrenClassName="items-end"
        >
          {t("shift")}
        </KBtn>
      </Row>

      {/* sixth Row */}
      <Row>
        <KBtn
          className=""
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-end w-full pr-1">
            <span className="block">fn</span>
          </div>
          <div className="flex justify-start w-full pl-1">
            <Icon icon="tabler:world" className="h-[4.8px] w-[4.8px]" />
          </div>
        </KBtn>
        <KBtn
          className=""
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-end w-full pr-1">
            <Icon icon="tabler:chevron-up" className="h-[4.8px] w-[4.8px]" />
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("control")}</span>
          </div>
        </KBtn>
        <KBtn
          className=""
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-end w-full pr-1">
            <OptionKey className="h-[4.8px] w-[4.8px]" />
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("option")}</span>
          </div>
        </KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-end w-full pr-1">
            <Icon icon="tabler:command" className="h-[4.8px] w-[4.8px]" />
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("command")}</span>
          </div>
        </KBtn>
        <KBtn className="w-[6.56rem]"></KBtn>
        <KBtn
          className="w-8"
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-start w-full pl-1">
            <Icon icon="tabler:command" className="h-[4.8px] w-[4.8px]" />
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("command")}</span>
          </div>
        </KBtn>
        <KBtn
          className=""
          childrenClassName="h-full justify-between py-[3.2px]"
        >
          <div className="flex justify-start w-full pl-1">
            <OptionKey className="h-[4.8px] w-[4.8px]" />
          </div>
          <div className="flex justify-start w-full pl-1">
            <span className="block">{t("option")}</span>
          </div>
        </KBtn>
        <div className="w-[4.9rem] mt-[1.8px] h-6 p-[0.4px] rounded-[3.2px] flex flex-col justify-end items-center">
          <KBtn className="w-6 h-3">
            <Icon icon="tabler:caret-up" className="h-[4.8px] w-[4.8px]" />
          </KBtn>
          <div className="flex">
            <KBtn className="w-6 h-3">
              <Icon icon="tabler:caret-left" className="h-[4.8px] w-[4.8px]" />
            </KBtn>
            <KBtn className="w-6 h-3">
              <Icon icon="tabler:caret-down" className="h-[4.8px] w-[4.8px]" />
            </KBtn>
            <KBtn className="w-6 h-3">
              <Icon icon="tabler:caret-right" className="h-[4.8px] w-[4.8px]" />
            </KBtn>
          </div>
        </div>
      </Row>
    </div>
  );
};
export const KBtn = ({
  className,
  children,
  childrenClassName,
  backlit = true,
}: {
  className?: string;
  children?: React.ReactNode;
  childrenClassName?: string;
  backlit?: boolean;
}) => {
  return (
    <div
      className={cn(
        "p-[0.4px] rounded-[3.2px]",
        backlit && "bg-white/[0.2] shadow-xl shadow-white"
      )}
    >
      <div
        className={cn(
          "h-6 w-6 bg-[#0A090D] rounded-[3.5px] flex items-center justify-center",
          className
        )}
        style={{
          boxShadow:
            "0px -0.4px 2px 0 #0D0D0F inset, -0.4px 0px 2px 0 #0D0D0F inset",
        }}
      >
        <div
          className={cn(
            "text-neutral-200 text-[4px] w-full flex justify-center items-center flex-col",
            childrenClassName,
            backlit && "text-white"
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
};
export const Row = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-[1.8px] mb-[1.8px] w-full flex-shrink-0">
      {children}
    </div>
  );
};
export const SpeakerGrid = () => {
  return (
    <div
      className="flex px-[0.4px] gap-[1.8px] mt-2 h-40"
      style={{
        backgroundImage:
          "radial-gradient(circle, #08080A 0.4px, transparent 0.4px)",
        backgroundSize: "2.4px 2.4px",
      }}
    ></div>
  );
};
export const OptionKey = ({ className }: { className: string }) => {
  return (
    <svg
      fill="none"
      version="1.1"
      id="icon"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 25.6 25.6"
      className={className}
    >
      <rect
        stroke="currentColor"
        strokeWidth={2}
        x="18"
        y="5"
        width="10"
        height="2"
      />
      <polygon
        stroke="currentColor"
        strokeWidth={2}
        points="10.6,5 4,5 4,7 9.4,7 18.4,27 28,27 28,25 19.6,25 "
      />
      <rect
        id="_Transparent_Rectangle_"
        className="st0"
        width="25.6"
        height="25.6"
        stroke="none"
      />
    </svg>
  );
};
