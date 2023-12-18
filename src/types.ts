// Types that exist: "Node", "Image", "Poly", "Path", "Wire", "Sprite", "Nine",
// "Label", "Button", "Progress", "Slider", "Textfield"
// Source: https://www.cs.cornell.edu/courses/cs5152/2023sp/resources/engine/CUGL-Scenegraph.pdf

export type OutputFormat = "node" | "widget";

type CUGLXY = [number, number];
type CUGLLBRT = [number, number, number, number];
type CUGLMinMax = [number, number];
type CUGLRGBA = [number, number, number, number];
type CUGLXYWH = [number, number, number, number];

type CUGLNodeType =
  | CUGLBaseNode
  | CUGLButtonNode
  | CUGLLabelNode
  | CUGLTextFieldNode
  | CUGLImageNode
  | CUGLNinePatchNode
  | CUGLSliderNode
  | CUGLProgressBarNode
  | CUGLPathNode;

type CUGLLayoutMixin = {} | CUGLAnchoredLayoutMixin | CUGLFloatLayoutMixin;

export type CUGLNode = CUGLNodeType & CUGLChildrenMixin & CUGLLayoutMixin;

export type CUGLChildrenMixin = {
  children?: { [key: string]: CUGLNode };
};

export type CUGLAnchoredLayoutMixin = {
  format: {
    type: "Anchored";
  };
  children: {
    [key: string]: {
      layout: {
        x_offset?: number;
        y_offset?: number;
        absolute?: boolean;
        x_anchor?: "left" | "center" | "right" | "fill";
        y_anchor?: "bottom" | "middle" | "top" | "fill";
      };
    };
  };
};

export type CUGLFloatLayoutMixin = {
  format: {
    type: "Float";
    orientation: "horizontal" | "vertical";
    x_alignment: "left" | "center" | "right";
    y_alignment: "bottom" | "middle" | "top";
  };
  children: {
    [key: string]: {
      layout: {
        priority: number;
      };
    };
  };
};

// TODO: Some of these fields may be optional (need to figure out which)
type Data = {
  position?: CUGLXY;
  size?: CUGLXY;
  anchor?: CUGLXY;
  scale?: number | CUGLXY;
  angle?: number; // in degrees
  visible?: boolean;
};

export type CUGLBaseNode = {
  type: "Node";
  data: Data;
};

export type CUGLButtonNode = {
  type: "Button";
  data: Data & {
    upnode: string;
    downnode: string | CUGLRGBA;
  };
};

export type CUGLLabelNode = {
  type: "Label";
  data: Data & {
    font: string;
    text: string;
    foreground: CUGLRGBA;
    background: CUGLRGBA;
    padding: CUGLLBRT;
    halign:
      | "left"
      | "center"
      | "right"
      | "hard left"
      | "true center"
      | "hard right";
    valign:
      | "top"
      | "middle"
      | "bottom"
      | "hard top"
      | "true middle"
      | "hard bottom";
  };
};

export type CUGLImageNode = {
  type: "Image";
  data: Data & {
    texture: string;
  };
};

export type CUGLTextFieldNode = {
  type: "TextField";
  data: Data & {
    font: string;
    text: string;
    foreground: CUGLRGBA;
    background: CUGLRGBA;
    padding: CUGLLBRT;
    halign:
      | "left"
      | "center"
      | "right"
      | "hard left"
      | "true center"
      | "hard right";
    valign:
      | "top"
      | "middle"
      | "bottom"
      | "hard top"
      | "true middle"
      | "hard bottom";
  };
};

export type CUGLNinePatchNode = {
  type: "Nine";
  data: Data & {
    texture: string;
    interior: CUGLXYWH;
  };
};

export type CUGLSliderNode = {
  type: "Slider";
  data: Data & {
    bounds: CUGLXYWH;
    range: CUGLMinMax;
    value?: number;
    tick?: number;
    snap?: boolean;
    knob: CUGLButtonNode;
    path?: CUGLPathNode;
  };
};

export type CUGLProgressBarNode = {
  type: "Progress";
  data: Data & {
    background: string;
    foreground: string;
    left_cap?: string;
    right_cap?: string;
  };
};

export type CUGLPathNode = {
  type: "Path";
  data: Data & {
    polygon?: number[];
    stroke?: number;
    joint?: "mitre" | "bevel" | "round";
    cap?: "square" | "round";
    closed?: boolean;
  };
};

export type CUGLWidget = {
  variables: {
    [key: string]: string[];
  };
  contents: CUGLNode;
};
