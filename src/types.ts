import type { Component, Raw } from "vue";

export interface BentoGridProps {
  grids: BentoGridItemProps[];
  max: number;
  gutter?: number;
  class?: string;
  tilt?: boolean;
  disabled?: boolean;
  size?: number;
  item?: Raw<Component<BentoGridItemProps & Record<string, string>>>;
}

export interface BentoGridItemType {
  id: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  index?: number;
  item?: Raw<Component<any>>;
  [key: string]: any;
}

export type BentoGridItemProps = Pick<BentoGridItemType, 'id' | 'x' | 'y' | 'w' | 'h' | 'index'>;

export type RequiredBentoGridItemProps = Required<BentoGridItemProps>;