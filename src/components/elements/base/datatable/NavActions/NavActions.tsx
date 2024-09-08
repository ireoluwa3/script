import { useDataTable } from "@/stores/datatable";
import { NavActionsProps } from "./NavActions.types";
import ToggleSwitch from "@/components/elements/form/toggle-switch/ToggleSwitch";
import IconButton from "../../button-icon/IconButton";
import { Icon } from "@iconify/react";
import { AnimatedTooltip } from "../../tooltips/AnimatedTooltip";
import { useTranslation } from "next-i18next";

const NavActionsBase = ({ navAction, navActionsSlot }: NavActionsProps) => {
  const { t } = useTranslation();
  const { actionConfigs, navActionsState, handleAction } = useDataTable(
    (state) => state
  );

  const renderActions = (actions) =>
    actions?.map((action, index) => (
      <div key={index}>
        {action.type === "checkbox" ? (
          <ToggleSwitch
            label={t(action.label)}
            color={action.color}
            sublabel={t(action.sublabel)}
            checked={navActionsState[action.topic]}
            onChange={() => handleAction(action)}
          />
        ) : (
          <AnimatedTooltip content={t(action.label)}>
            <IconButton
              variant="pastel"
              aria-label={t(action.label)}
              onClick={() => handleAction(action)}
              color={action.color || "primary"}
              size="lg"
            >
              <Icon icon={action.icon} className="h-6 w-6" />
            </IconButton>
          </AnimatedTooltip>
        )}
      </div>
    ));

  return (
    <>
      {navAction
        ? renderActions([navAction])
        : (navActionsSlot || actionConfigs?.navActionsConfig?.length > 0) && (
            <div className="flex items-start justify-between sm:justify-end w-full sm:w-auto gap-3">
              <div className="flex items-start justify-between w-full gap-5">
                {navActionsSlot}
                {renderActions(actionConfigs?.navActionsConfig)}
              </div>
            </div>
          )}
    </>
  );
};

export const NavActions = NavActionsBase;
