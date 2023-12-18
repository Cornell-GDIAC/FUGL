import {
  CUGLAnchoredLayoutMixin,
  CUGLFloatLayoutMixin,
  CUGLLabelNode,
} from "./types";

export const convertTextAlignVertical = (
  value: TextNode["textAlignVertical"],
): CUGLLabelNode["data"]["valign"] => {
  switch (value) {
    case "BOTTOM":
      return "bottom";
    case "TOP":
      return "top";
    case "CENTER":
      return "middle";
  }
};

export const convertTextAlignHorizontal = (
  value: TextNode["textAlignHorizontal"],
): CUGLLabelNode["data"]["halign"] => {
  switch (value) {
    case "LEFT":
      return "left";
    case "CENTER":
      return "center";
    case "RIGHT":
      return "right";
    case "JUSTIFIED":
      throw new Error(`${value} is not supported`);
  }
};

export const convertLayoutMode = (
  value: Exclude<AutoLayoutMixin["layoutMode"], "NONE">,
): CUGLFloatLayoutMixin["format"]["orientation"] => {
  switch (value) {
    case "HORIZONTAL":
      return "horizontal";
    case "VERTICAL":
      return "vertical";
  }
};

export const convertXAlign = (
  value:
    | FrameNode["primaryAxisAlignItems"]
    | FrameNode["counterAxisAlignItems"],
): CUGLFloatLayoutMixin["format"]["x_alignment"] => {
  switch (value) {
    case "MIN":
      return "left";
    case "MAX":
      return "right";
    case "CENTER":
      return "center";
    case "SPACE_BETWEEN":
    case "BASELINE":
      throw new Error(`${value} is not supported`);
  }
};

export const convertYAlign = (
  value:
    | FrameNode["primaryAxisAlignItems"]
    | FrameNode["counterAxisAlignItems"],
): CUGLFloatLayoutMixin["format"]["y_alignment"] => {
  switch (value) {
    case "MIN":
      return "top";
    case "MAX":
      return "bottom";
    case "CENTER":
      return "middle";
    case "SPACE_BETWEEN":
    case "BASELINE":
      throw new Error(`${value} is not supported`);
  }
};

export const convertXAnchor = (
  value?: RectangleNode["constraints"]["horizontal"],
): [
  number,
  CUGLAnchoredLayoutMixin["children"]["key"]["layout"]["x_anchor"],
] => {
  switch (value) {
    case "MIN":
      return [0, "left"];
    case "CENTER":
      return [0.5, "center"];
    case "MAX":
      return [1, "right"];
    case "STRETCH":
    case "SCALE":
    default:
      return [0, "left"];
  }
};

export const convertYAnchor = (
  value?: RectangleNode["constraints"]["vertical"],
): [
  number,
  CUGLAnchoredLayoutMixin["children"]["key"]["layout"]["y_anchor"],
] => {
  switch (value) {
    case "MIN":
      return [1, "top"];
    case "CENTER":
      return [0.5, "middle"];
    case "MAX":
      return [0, "bottom"];
    case "STRETCH":
    case "SCALE":
    default:
      return [0, "bottom"];
  }
};
