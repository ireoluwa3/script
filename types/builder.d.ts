/**
 * Component Conversion Guidelines:
 *
 * 1. Convert all Tailwind classes to functional component props.
 * 2. Convert all HTML elements to functional components:
 *    - `div` or `container` -> `Container`
 *    - `h1`, `h2`, `h3`, `h4`, `h5`, `h6` -> `Text` with `fontSize` and `fontWeight` props.
 *    - `p` or any text element -> `Text`
 *    - `input` -> `Input`
 *    - `button` -> `Button`
 *    - `img` -> `Image`
 *    - `svg` -> `Icon` with `icon` prop from Iconify (e.g., mdi:home)
 *    - `input[type="checkbox"]` -> `Checkbox`
 *    - `tag` -> `Tag`
 *    - `textarea` -> `Textarea`
 *    - `a` -> `LinkText`
 *    - Any custom component -> New custom component
 *
 * 3. For Container Element:
 *    - Use `<Container>>` only for the root component.
 *    - For internal Containers, use `Element` with `is={Container}` and `canvas` prop.
 *    - Ensure `Container` props are used correctly (e.g., padding and margin as arrays of 4 values).
 *    - Never use Container in the component more than once that at the start of component.
 *    - Keep `overflow` as a `className`.
 *    - Margin and padding should be an array of 4 values (e.g., ["16px", "0", "16px", "0"]).
 *    - always add canvas prop to Element component.
 *    - always add id prop to Element component with the name-of-the-component_unique-id.
 *
 * 4. For Text:
 *    - Use `fontSize` in `px` and make sure it is non-responsive.
 *    - Use `fontWeight` as a string, not an integer.
 *    - Use `textAlign` only within text elements.
 *    - Nest `Text` component inside `Container` for alignment and spacing.
 *
 * 5. Ensure height is a string and not responsive.
 * 6. Use correct values for `justifyContent` (e.g., "start" instead of "flex-start").
 * 7. Do not set `background` on `LinkText`.
 * 8. Move background color to the parent `Container` of `LinkText` with hover background.
 * 9. Any responsive prop (e.g., gridCols, padding, margin) needs a base value. If not provided, use zeros for padding or margin and 1 for gridCols.
 * 10. Remove Tailwind classes after converting.
 *
 * 11. Always export components like:
 *  - `ComponentName.craft = { ...Container.craft, displayName: "ComponentName" };` for Craft.js.
 *    - `export const components = { ComponentName };`
 *    - `export default ComponentName;`
 *
 * Example usage:
 * import { Container, Text } from "@/components/builder/selectors";
 * import Icon from "@/components/builder/selectors/Icon";
 * import { Element } from "@craftjs/core";
 *
 * const ComponentName = () => {
 *   return (
 *     <Container
 *       background={{ r: 17, g: 24, b: 39, a: 1 }}
 *       color={{ r: 255, g: 255, b: 255, a: 1 }}
 *       display={{ base: "block", lg: "flex" }}
 *       flexDirection={{ base: "column", lg: "row" }}
 *       alignItems={{ base: "flex-start", lg: "center" }}
 *       justifyContent={{ base: "start", lg: "center" }}
 *       maxWidth={{ base: "100%", lg: "1280px" }}
 *       padding={{ base: ["32px", "16px", "32px", "16px"], lg: ["32px", "16px", "32px", "16px"] }}
 *       margin={{ base: ["0", "auto", "0", "auto"] }}
 *       height="100vh"
 *       {...Container.craft}
 *     >
 *       <Element
 *         is={Container}
 *         id="ComponentName-unique-id"
 *         canvas
 *         background={{ r: 16, g: 185, b: 129, a: 1 }}
 *         maxWidth={{ base: "100%", lg: "768px" }}
 *         margin={{ base: ["0", "auto", "0", "auto"], lg: ["0", "auto", "0", "auto"] }}
 *       >
 *         <Text
 *           fontSize="24px"
 *           fontWeight="700"
 *           color={{ r: 255, g: 255, b: 255, a: 1 }}
 *           text="Example Text"
 *           margin={{ base: ["0", "0", "16px", "0"], lg: ["0", "0", "16px", "0"] }}
 *         />
 *         <Text
 *           fontSize="16px"
 *           color={{ r: 209, g: 213, b: 219, a: 1 }}
 *           text="Lorem ipsum dolor sit amet..."
 *           margin={{ base: ["16px", "0", "0", "0"], lg: ["16px", "0", "0", "0"] }}
 *           width="auto"
 *         />
 *         <Element
 *           is={Container}
 *           canvas
 *           id="ComponentName-unique-id"
 *           display={{ base: "flex" }}
 *           justifyContent={{ base: "center" }}
 *           gap={{ base: "16px" }}
 *           margin={{ base: ["32px", "0", "0", "0"], lg: ["32px", "0", "0", "0"] }}
 *         >
 *           <LinkText
 *             href="/get-started"
 *             text="Get Started"
 *             fontSize="14px"
 *             fontWeight="500"
 *             textAlign="center"
 *             textDecoration="none"
 *             color={{ r: 255, g: 255, b: 255, a: 1 }}
 *             borderColor={{ r: 37, g: 99, b: 235, a: 1 }}
 *             hoverColor={{ r: 255, g: 255, b: 255, a: 1 }}
 *             padding={{ base: ["12px", "32px", "12px", "32px"] }}
 *             borderWidth={1}
 *             borderStyle="solid"
 *             borderRadius={8}
 *             className="cursor-pointer shadow hover:bg-transparent focus:outline-none focus:ring active:text-opacity-75"
 *           />
 *           <LinkText
 *             href="/about"
 *             text="Learn More"
 *             fontSize="14px"
 *             fontWeight="500"
 *             textAlign="center"
 *             textDecoration="none"
 *             color={{ r: 255, g: 255, b: 255, a: 1 }}
 *             borderColor={{ r: 37, g: 99, b: 235, a: 1 }}
 *             hoverColor={{ r: 255, g: 255, b: 255, a: 1 }}
 *             padding={{ base: ["12px", "32px", "12px", "32px"] }}
 *             borderWidth={1}
 *             borderStyle="solid"
 *             borderRadius={8}
 *             className="cursor-pointer shadow focus:outline-none focus:ring active:bg-blue-500"
 *           />
 *         </Element>
 *       </Element>
 *     </Container>
 *   );
 * };
 *
 * ComponentName.craft = {
 *  ...Container.craft,
 *  displayName: "ComponentName",
 * };
 *
 * export const components = { ComponentName };
 * export default ComponentName;
 */

type ResponsiveProp<T> = Partial<
  Record<"xs" | "sm" | "md" | "lg" | "xl", T>
> & { base: T };

type ButtonProps = {
  background?: Record<"r" | "g" | "b" | "a", string | number>;
  darkBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  color?: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  margin?: ResponsiveProp<string[]>; // responsive prop
  padding?: ResponsiveProp<string[]>; // responsive prop
  text?: string;
  textComponent?: any;
  buttonStyle?: string;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  hoverBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  darkHoverBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  hoverColor?: Record<"r" | "g" | "b" | "a", string | number>;
  darkHoverColor?: Record<"r" | "g" | "b" | "a", string | number>;
  borderRadius?: number;
  icon?: string;
  className?: string;
  children?: React.ReactNode;
};

type CheckboxProps = {
  id: string;
  required?: boolean;
  className?: string;
  label?: string;
  labelClassName?: string;
  color?: "default" | "primary" | "info" | "success" | "warning" | "danger";
  shape?: "rounded" | "smooth" | "curved" | "full";
};

type ContainerProps = {
  background: Record<"r" | "g" | "b" | "a", string | number>;
  darkBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  hoverBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  darkHoverBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  hoverBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  darkHoverBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  display: ResponsiveProp<"none" | "block" | "flex" | "grid">;
  flexDirection: ResponsiveProp<"row" | "column">;
  flexWrap: "wrap" | "nowrap";
  alignItems: ResponsiveProp<"flex-start" | "center" | "flex-end">;
  justifyContent: ResponsiveProp<
    | "start"
    | "center"
    | "end"
    | "space-between"
    | "space-around"
    | "space-evenly"
    | "stretch"
  >;
  fillSpace: "yes" | "no";
  width: string | "auto";
  height: string | "auto";
  maxWidth: ResponsiveProp<string | number>; // like "100%" or 1280 etc
  padding: ResponsiveProp<string[]>;
  margin: ResponsiveProp<string[]>;
  shadow: number;
  children: React.ReactNode;
  radius: number;
  boxShadow: string;
  boxShadowOffsetX: number;
  boxShadowOffsetY: number;
  boxShadowBlur: number;
  boxShadowSpread: number;
  boxShadowColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkBoxShadowColor?: Record<"r" | "g" | "b" | "a", string | number>;
  borderWidth: number;
  borderStyle: string;
  borderColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  borderRadius: number;
  gap: ResponsiveProp<number | string>;
  gridCols: ResponsiveProp<number>;
  className?: string;
};

type IconProps = {
  id: string;
  name: string;
  width: number | string;
  height: number | string;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  className?: string;
};

type ObjectFit =
  | "fill"
  | "contain"
  | "cover"
  | "none"
  | "scale-down"
  | "unset"
  | "initial"
  | "inherit";

type ImageProps = {
  src: string;
  alt: string;
  width: ResponsiveProp<string>;
  height: ResponsiveProp<string>;
  borderRadius: number;
  objectFit: string;
  objectPosition: string;
  boxShadow: string;
  borderWidth: number;
  borderStyle: string;
  borderColor: Record<"r" | "g" | "b" | "a", string>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string>;
  margin: ResponsiveProp<string[]>;
  className?: string;
};

type InputProps = {
  type: string;
  placeholder: string;
  required: boolean;
  padding: ResponsiveProp<string[]>;
  background: Record<"r" | "g" | "b" | "a", string | number>;
  darkBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  borderColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  boxShadowColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkBoxShadowColor?: Record<"r" | "g" | "b" | "a", string | number>;
  ringColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkRingColor?: Record<"r" | "g" | "b" | "a", string | number>;
  className?: string;
};

type TagProps = {
  text?: string;
  background?: Record<"r" | "g" | "b" | "a", string | number>;
  darkBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  color?: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  borderRadius?: number;
  padding?: ResponsiveProp<string[]>;
  children?: React.ReactNode;
};

type TextProps = {
  fontSize: string;
  textAlign: string;
  fontWeight: string;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  shadow: number;
  text: string;
  margin: ResponsiveProp<string[]>;
  width: string;
  className?: string;
};

type TextareaProps = {
  id: string;
  rows?: number;
  placeholder?: string;
  padding: ResponsiveProp<string[]>;
  background: Record<"r" | "g" | "b" | "a", string | number>;
  darkBackground?: Record<"r" | "g" | "b" | "a", string | number>;
  borderColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  className?: string;
  borderRadius?: number;
  resize?: boolean;
  error?: string;
  loading?: boolean;
};

type TextAlign = "left" | "center" | "right";

type LinkTextProps = {
  href: string;
  text: string;
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  textDecoration: string;
  color: Record<"r" | "g" | "b" | "a", string | number>;
  darkColor?: Record<"r" | "g" | "b" | "a", string | number>;
  hoverColor: Record<"r" | "g" | "b" | "a", string | number>;
  darkHoverColor?: Record<"r" | "g" | "b" | "a", string | number>;
  margin: ResponsiveProp<string[]>;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  darkBorderColor?: Record<"r" | "g" | "b" | "a", string | number>;
  padding?: ResponsiveProp<string[]>;
  className?: string;
  icon?: string;
  children?: React.ReactNode;
};

type StaticPropsReturn = {
  props: { data?: dataType[] };
};

interface RootProps {
  childNodes: RootProps[];
  attrs: map<string, string>;
  tagName: string;
  classNames: string;
  nodeType: number;
  innerText: string;
  constructor: any;
}

interface dataType {
  content: string;
  name?: string;
}

interface StaticBuildProps {
  data?: dataType[];
}

interface ContentProviderProps extends StaticBuildProps {
  showEditorInProd: boolean;
  standaloneServer: boolean;
}
