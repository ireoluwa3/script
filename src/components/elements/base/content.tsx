import Table from "@/components/elements/base/table/Table";
import TH from "@/components/elements/base/table/TH";
import TD from "@/components/elements/base/table/TD";
import Button from "@/components/elements/base/button/Button";
import Link from "next/link";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import { motion, useInView } from "framer-motion";
import { createElement, useRef } from "react";
import { Icon } from "@iconify/react";
import { MashImage } from "../MashImage";
import Image from "next/image";

export const ContentBlock = ({ block, idx }) => {
  const itemVariants = {
    hidden: { opacity: 0, x: 0 },
    visible: { opacity: 1, x: 50 },
  };

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  switch (block.type) {
    case "paragraph":
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
          className="text-gray-600 dark:text-gray-400"
        >
          <p>{block.data.text}</p>
        </motion.div>
      );

    case "header":
      const level = Number(block.data.level);
      const className = `text-${
        level === 1 ? "4xl" : level === 2 ? "3xl" : level === 3 ? "2lg" : "base"
      }`;
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
          className={`${className}`}
        >
          {createElement(
            `h${level}`,
            {
              className: " font-bold text-muted-800 dark:text-muted-200",
            },
            block.data.text
          )}
        </motion.div>
      );
    case "quote":
      return (
        <motion.blockquote
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
          className="italic border-l-4 pl-4  text-gray-600 dark:text-gray-400"
        >
          <p>{block.data.text}</p>
          <cite>{block.data.caption}</cite>
        </motion.blockquote>
      );
    case "list":
      return (
        <motion.ul
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="list-disc list-inside text-gray-600 dark:text-gray-400"
        >
          {block.data.items.map((item, itemIdx) => (
            <li key={itemIdx}>{item.content}</li>
          ))}
        </motion.ul>
      );

    case "quote":
      return (
        <motion.blockquote
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="italic border-l-4 pl-4  text-gray-600 dark:text-gray-400"
        >
          <p>{block.data.text}</p>
          <cite>{block.data.caption}</cite>
        </motion.blockquote>
      );
    case "list":
      return (
        <motion.ul
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="list-disc list-inside text-gray-600 dark:text-gray-400"
        >
          {block.data.items.map((item, itemIdx) => (
            <li key={itemIdx}>{item.content}</li>
          ))}
        </motion.ul>
      );
    case "checklist":
      return (
        <motion.ul
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="list-none text-gray-600 dark:text-gray-400"
        >
          {block.data.items.map((item, itemIdx) => (
            <li key={itemIdx} className="flex items-center gap-2">
              <Checkbox
                type="checkbox"
                checked={item.checked}
                readOnly
                color="primary"
              />
              {item.text}
            </li>
          ))}
        </motion.ul>
      );
    case "image":
      return (
        <motion.div
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          style={{
            border: block.data.withBorder ? "1px solid black" : "none",
          }}
        >
          <img
            src={block.data.file.url}
            alt={block.data.caption}
            className="w-full rounded-xl"
            style={{
              width: block.data.stretched ? "100%" : "auto",
              backgroundColor: block.data.withBackground
                ? "#f0f0f0"
                : "transparent",
            }}
          />
          {block.data.caption && <p>{block.data.caption}</p>}
        </motion.div>
      );
    case "table":
      return (
        <motion.span
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
        >
          <Table className="prose-none w-full overflow-x-auto rounded-lg border border-muted-200 bg-white dark:border-muted-900 dark:bg-muted-950">
            {block.data.withHeadings && (
              <thead>
                <tr className="bg-muted-50 dark:bg-muted-900">
                  {block.data.content[0].map((heading, headingIdx) => (
                    <TH key={headingIdx}>{heading}</TH>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.data.content
                .slice(block.data.withHeadings ? 1 : 0)
                .map((row, rowIdx) => (
                  <tr key={rowIdx}>
                    {row.map((cell, cellIdx) => (
                      <TD key={cellIdx}>
                        <div className="text-muted-800 dark:text-muted-100">
                          {cell}
                        </div>
                      </TD>
                    ))}
                  </tr>
                ))}
            </tbody>
          </Table>
        </motion.span>
      );
    case "code":
      return (
        <motion.pre
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="bg-gray-100 dark:bg-gray-800 p-4"
        >
          {block.data.code}
        </motion.pre>
      );
    case "button":
      return (
        <motion.span
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
        >
          <Link href={block.data.link} className="prose-none ">
            <Button key={idx} variant={"pastel"} size={"md"} color={"primary"}>
              {block.data.text}
            </Button>
          </Link>
        </motion.span>
      );
    case "delimiter":
      return (
        <motion.hr
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
        />
      );
    case "raw":
      return (
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          key={idx}
          dangerouslySetInnerHTML={{ __html: block.data.html }}
        />
      );
    case "warning":
      return (
        <motion.div
          key={idx}
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={itemVariants}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-2 border py-3 pe-2 ps-4 rounded-md bg-warning-50 text-warning-500 dark:bg-muted-800 dark:text-warning-300 mb-5
            border-warning-500 dark:border-warning-300
          "
        >
          <Icon
            height={24}
            width={24}
            icon={"ph:warning-octagon-duotone"}
            className={"text-warning-500 dark:text-warning-300"}
          />
          <div>
            <div className="text-sm font-semibold text-warning-500 dark:text-warning-300">
              {block.data.title}
            </div>
            <div className="text-xs text-warning-500 dark:text-warning-300">
              {block.data.message}
            </div>
          </div>
        </motion.div>
      );

    default:
      return null;
  }
};
