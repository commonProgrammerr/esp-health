import { CSSProperties, ReactNode } from "react";
// import { HiOutlineChevronDown } from "react-icons/hi";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import _styles from "./styles.module.css";

import {
  Select,
  SelectContent,
  SelectIcon,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@radix-ui/react-select";
import { DeviceStatus, getStatusText, status_texts } from "@/utils/enums";
// import * as SelectPrimitive from '@radix-ui/react-select'

interface Props {
  name?: string;
  label?: string;
  children?: ReactNode;
  options: Array<{
    name: string;
    value: string;
  }>;
  value?: string;
  onChange?: (value: any) => void;
  startBlak?: boolean;
  className?: string;
  styles?: CSSProperties;
  placeholder?: string;
}

export function getStatusStyle(status?: number) {
  switch (status as DeviceStatus) {
    case DeviceStatus.REDY:
      return { backgroundColor: "#3ba367", color: "white" };
    case DeviceStatus.BROKEN:
      return { backgroundColor: "#b85d53", color: "white" };
    case DeviceStatus.NEW:
      return { backgroundColor: "#109a93", color: "white" };
    case DeviceStatus.PRINTED:
      return { backgroundColor: "#6450be", color: "white" };
    default:
      return { color: "#000a" };
  }
}

function SelectComponent({
  label,
  options,
  onChange,
  startBlak,
  value,
  placeholder,
  styles,
  className,
  ...rest
}: Props) {
  return (
    <div className={_styles.Container}>
      {label && <label className={_styles.Label}>{label}</label>}
      <Select value={value} {...rest} onValueChange={onChange}>
        <SelectTrigger
          className={_styles.Trigger}
          style={{ ...styles, ...getStatusStyle(Number(value)) }}
        >
          <SelectValue
            defaultValue={options[0].value}
            placeholder={placeholder}
            onChange={onChange}
          />
          <SelectIcon>
            <ChevronDownIcon />
          </SelectIcon>
        </SelectTrigger>
        <SelectContent className={_styles.Content}>
          <SelectScrollUpButton className={_styles.scrollButton}>
            <ChevronUpIcon />
          </SelectScrollUpButton>
          <SelectViewport className={_styles.Viewport}>
            {startBlak && !value && (
              <SelectItem value="">
                <SelectItemText>{""}</SelectItemText>
                {/* <SelectItemIndicator>
                  <Check />
                </SelectItemIndicator> */}
              </SelectItem>
            )}
            {options?.map(
              (option, i) =>
                option && (
                  <SelectItem
                    className={_styles.Item}
                    key={i}
                    value={option.value}
                    style={getStatusStyle(Number(option.value))}
                  >
                    <SelectItemText
                      className={_styles.ItemText}
                      style={getStatusStyle(Number(option.value))}
                    >
                      {option.name}
                    </SelectItemText>
                    <SelectItemIndicator className={_styles.ItemIndicator}>
                      <CheckIcon />
                    </SelectItemIndicator>
                  </SelectItem>
                )
            )}
          </SelectViewport>
          <SelectScrollDownButton className={_styles.scrollButton}>
            <ChevronDownIcon />
          </SelectScrollDownButton>
        </SelectContent>
      </Select>
    </div>
  );
}

export { SelectComponent as Select };
