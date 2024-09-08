import type { FC } from "react";
import Card from "@/components/elements/base/card/Card";

interface ChartWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  label: string;
}
const ChartWrapper: FC<ChartWrapperProps> = ({
  children,
  label,
  className: classes = "",
}) => (
  <div className={`w-full ${classes}`}>
    <Card shape="smooth" color="contrast" className="p-4">
      <div className="p-4">
        <h3 className="font-sans text-base font-medium leading-tight text-muted-800 dark:text-muted-100">
          {label}
        </h3>
      </div>
      {children}
    </Card>
  </div>
);

export default ChartWrapper;
