import { memo } from "react";
import { VisibilityControls } from "../VisibilityControls";
import { PercentageBar } from "../PercentageBar";

const OrderbookHeaderBase = ({
  visible,
  setVisible,
  askPercentage,
  bidPercentage,
}) => {
  return (
    <div className="flex justify-between items-center p-2 gap-4">
      <VisibilityControls visible={visible} setVisible={setVisible} />
      <PercentageBar
        askPercentage={askPercentage}
        bidPercentage={bidPercentage}
      />
    </div>
  );
};

export const OrderbookHeader = memo(OrderbookHeaderBase);
