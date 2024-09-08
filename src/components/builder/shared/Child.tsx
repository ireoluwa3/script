import React from "react";
import { Element, useNode } from "@craftjs/core";
import { Text } from "./Text";
import { Link } from "./Link";
import { Button } from "./Button";
import { Image } from "./Image";
import { Svg } from "./Svg";
import Input from "@/components/elements/form/input/Input";
import Textarea from "@/components/elements/form/textarea/Textarea";
import Checkbox from "@/components/elements/form/checkbox/Checkbox";
import Radio from "@/components/elements/form/radio/Radio";
import { cleanHTMLAttrs, transferLabelInnerText } from "../utils/html";
import Div from "./Div";

interface ChildProps {
  root: RootProps;
  d?: number[];
}

const Child: React.FC<ChildProps> = ({ root, d = [0] }) => {
  if (!root || root?.childNodes.length === 0) return null;

  return (
    <>
      {Array.from(root?.childNodes).map((r, i) => {
        const key = d.concat(i).join("");
        const classNames = r.classNames?.toString() || "";
        const cleanedAttrs = cleanHTMLAttrs(r.attrs);

        if (r.nodeType === 1) {
          switch (r.tagName) {
            case "SECTION":
              return (
                <section className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </section>
              );
            case "DIV":
              return (
                <div className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </div>
              );
            case "H1":
              return (
                <h1 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h1>
              );
            case "H2":
              return (
                <h2 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h2>
              );
            case "H3":
              return (
                <h3 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h3>
              );
            case "H4":
              return (
                <h4 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h4>
              );
            case "H5":
              return (
                <h5 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h5>
              );
            case "H6":
              return (
                <h6 className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </h6>
              );
            case "P":
              return (
                <p className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </p>
              );
            case "A":
              return (
                <Element
                  is={Link}
                  key={key}
                  r={r}
                  d={d}
                  i={i}
                  id={key}
                  propId={key}
                />
              );
            case "SPAN":
              return (
                <span className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </span>
              );
            case "STRONG":
              return (
                <strong className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </strong>
              );
            case "EM":
              return (
                <em className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </em>
              );
            case "HEADER":
              return (
                <header className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </header>
              );
            case "MAIN":
              return (
                <main className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </main>
              );
            case "FOOTER":
              return (
                <footer className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </footer>
              );
            case "NAV":
              return (
                <nav className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </nav>
              );
            case "ASIDE":
              return (
                <aside className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </aside>
              );
            case "DETAILS":
              return (
                <details className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </details>
              );
            case "SUMMARY":
              return (
                <summary className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </summary>
              );
            case "BLOCKQUOTE":
              return (
                <blockquote className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)} />
                </blockquote>
              );
            case "INPUT":
              if (r.attrs.type === "checkbox") {
                return (
                  <Checkbox
                    className={classNames}
                    key={key}
                    {...cleanedAttrs}
                  />
                );
              } else if (r.attrs.type === "radio") {
                return (
                  <Radio
                    label={cleanedAttrs.label}
                    className={classNames}
                    key={key}
                    {...cleanedAttrs}
                  />
                );
              } else {
                return (
                  <Input className={classNames} key={key} {...cleanedAttrs} />
                );
              }
            case "LABEL":
              transferLabelInnerText(r);
              return;
            case "TEXTAREA":
              return (
                <Textarea
                  defaultValue={r.innerText}
                  className={classNames}
                  key={key}
                  {...cleanedAttrs}
                />
              );
            case "BUTTON":
              return (
                <Element
                  is={Button}
                  key={key}
                  r={r}
                  d={d}
                  i={i}
                  id={key}
                  propId={key}
                />
              );
            case "FORM":
              return (
                <form className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)} />
                </form>
              );
            case "SVG":
              return <Element is={Svg} key={key} r={r} id={key} propId={key} />;
            case "ADDRESS":
              return (
                <address className={classNames} key={key} {...cleanedAttrs}>
                  <Text className={""} text={r.innerText} key={key} id={key} />
                </address>
              );
            case "FIGURE":
              return (
                <figure className={classNames} key={key} {...cleanedAttrs}>
                  <Child root={r} d={d.concat(i)} />
                </figure>
              );
            case "IMG":
              return (
                <Element
                  is={Image}
                  key={key}
                  d={d}
                  i={i}
                  classNames={classNames}
                  attrs={cleanedAttrs}
                  id={key}
                  propId={key}
                />
              );
            case "ARTICLE":
            case "DL":
            case "DD":
            case "DT":
              return (
                <article className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </article>
              );
            case "SCRIPT":
              return null;
            case "LINK":
              return (
                <link className={classNames} {...cleanedAttrs} key={key}></link>
              );
            case "BR":
              return <br className={classNames} key={key} />;
            case "UL":
              return (
                <ul className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </ul>
              );
            case "LI":
              return (
                <li className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </li>
              );
            case "CITE":
              return (
                <cite className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </cite>
              );
            case "HR":
              return <hr className={classNames} key={key}></hr>;
            case "IFRAME":
              return (
                <iframe className={classNames} {...cleanedAttrs} key={key} />
              );
            case "STYLE":
              return <style key={key}>{r.innerText}</style>;
            case "TABLE":
              return (
                <table className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </table>
              );
            case "THEAD":
              return (
                <thead className={classNames} {...cleanedAttrs} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </thead>
              );
            case "TBODY":
              return (
                <tbody className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </tbody>
              );
            case "TR":
              return (
                <tr className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </tr>
              );
            case "TD":
              return (
                <td className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </td>
              );
            case "TH":
              return (
                <th className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </th>
              );
            case "FIGCAPTION":
              return (
                <figcaption className={classNames} key={key}>
                  <Child root={r} d={d.concat(i)} />
                </figcaption>
              );
            default:
              return <p key={key}>Unknown container</p>;
          }
        } else if (r.nodeType === 3) {
          if (r.innerText.trim() === "") return null;
          return (
            <Text
              className={classNames}
              text={r.innerText ?? ""}
              key={key}
              id={key}
            />
          );
        } else {
          return <p key={key}>Unknown type</p>;
        }
      })}
    </>
  );
};

export default Child;

interface ComponentProps {
  root: RootProps;
}

const Component: React.FC<ComponentProps> = ({ root }) => {
  const { connectors, node } = useNode((node) => ({ node }));

  return (
    <div id={node.id} ref={(ref) => connectors.connect(ref as HTMLDivElement)}>
      <Child root={root} />
    </div>
  );
};

export { Component };
