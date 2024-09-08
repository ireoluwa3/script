import React, {
  type FC,
  type ReactNode,
  useRef,
  useState,
  useEffect,
  memo,
} from "react";
import { Icon } from "@iconify/react";
import Card from "@/components/elements/base/card/Card";

interface DealCardProps {
  isToggle: boolean;
  title: string;
  children: ReactNode;
}

const DealCardBase: FC<DealCardProps> = ({
  children,
  title,
  isToggle = false,
}) => {
  const [panelOpened, setPanelOpened] = useState(true);
  const dealCardContentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState("0px");

  useEffect(() => {
    if (panelOpened) {
      setContentHeight(dealCardContentRef.current?.scrollHeight + "px");
    } else {
      setContentHeight("0px");
    }
  }, [panelOpened, children]);

  return (
    <Card shape="smooth" color="contrast" className="p-5">
      <div
        onClick={() => {
          setPanelOpened(!panelOpened);
        }}
        className={`flex items-center justify-between ${
          isToggle ? "cursor-pointer" : ""
        }`}
      >
        <h3 className="font-sans text-xs font-medium uppercase text-muted-400">
          {title}
        </h3>
        <div
          className={`pointer-events-none ${panelOpened ? "rotate-90" : ""} ${
            isToggle
              ? "flex h-8 w-8 items-center justify-center rounded-full text-muted-400 transition-all duration-300 hover:bg-muted-100 dark:hover:bg-muted-800 [&>svg]:h-4"
              : ""
          }`}
        >
          <Icon icon="lucide:chevron-right" />
        </div>
      </div>
      <div
        ref={dealCardContentRef}
        style={{
          maxHeight: contentHeight,
        }}
        className={`grid grid-cols-1 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${
          panelOpened ? "mt-4" : "mt-0"
        }`}
      >
        {children}
      </div>
    </Card>
  );
};

export const DealCard = memo(DealCardBase);
