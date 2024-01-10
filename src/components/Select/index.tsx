import { SelectProps } from "@radix-ui/react-select";
import {
  ChangeEvent,
  ChangeEventHandler,
  CSSProperties,
  ReactNode,
  useState,
  SelectHTMLAttributes,
} from "react";
// import { HiOutlineChevronDown } from "react-icons/hi";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@radix-ui/react-icons";
import genId from "@/utils/genID";
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
import { StatusTypes } from "@/utils/enums";
// import * as SelectPrimitive from '@radix-ui/react-select'

interface Props {
  name?: string;
  label?: string;
  children?: ReactNode;
  options: string[];
  value?: string;
  onChange?: (value: any) => void;
  startBlak?: boolean;
  className?: string;
  styles?: CSSProperties;
  placeholder?: string;
}

function color(status?: string) {
  switch (status) {
    case StatusTypes.OK:
      return { backgroundColor: "#7AD39F", color: "white" };
    case StatusTypes.FAIL:
      return { backgroundColor: "#b85d53", color: "white" };
    case StatusTypes.PRINTED:
      return { backgroundColor: "#7ad3ce", color: "white" };
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
          style={{ ...styles, ...color(value) }}
        >
          <SelectValue
            defaultValue={options[0]}
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
                    value={option}
                    style={color(option)}
                  >
                    <SelectItemText
                      className={_styles.ItemText}
                      style={color(option)}
                    >
                      {option}
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
