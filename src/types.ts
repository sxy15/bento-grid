import type { Component, Raw, Ref } from "vue";

export interface BentoGridProps {
  grids: BentoGridItemProps[];
  max: number;
  gutter?: number;
  tilt?: boolean;
  disabled?: boolean;
  prefix?: string;
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

export type BindOps = {
  grids: Ref<BentoGridItemProps[]>;
  isDragging: Ref<boolean>;
  draggingId: Ref<string | undefined>;
  draggingPoint: { x: number, y: number };
  props: BentoGridProps;
}