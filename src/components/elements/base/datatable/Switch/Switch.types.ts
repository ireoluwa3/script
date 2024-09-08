export interface SwitchProps {
  initialState: boolean;
  endpoint: string;
  active?: boolean | string;
  disabled?: boolean | string;
  onUpdate?: (newState: boolean | string) => void;
}
