import type { Component, Raw, Ref } from "vue";

export const breakpoints = {
  lg: 1200,
  md: 996,
  sm: 768,
  xs: 480,
  xxs: 0
}

export const cols = {
  lg: 12,
  md: 10,
  sm: 6,
  xs: 4,
  xxs: 2
}
export interface BentoGridProps {
  grids: BentoGridItemProps[];
  max?: number;
  size?: number;
  gutter?: number;
  tilt?: boolean;
  draggable?: boolean;
  prefix?: string;
  item?: Component<BentoGridItemProps & Record<string, string>>;
  cols?: Record<keyof typeof breakpoints, number>;
}

export interface BentoGridItemType {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  index?: number;
  item?: Raw<Component<any>>;
  _x?: number;
  _y?: number;
  [key: string]: any;
}

export type BentoGridItemProps = Pick<BentoGridItemType, 'id' | 'x' | 'y' | 'w' | 'h' | 'index'>;

export type RequiredBentoGridItemProps = Required<BentoGridItemProps>;

export type BindOps = {
  grids: Ref<BentoGridItemProps[]>;
  isDragging: Ref<boolean>;
  draggingPoint: Ref<any>;
  placeholder: Ref<BentoGridItemProps>;
  size: number;
  props: BentoGridProps;
}