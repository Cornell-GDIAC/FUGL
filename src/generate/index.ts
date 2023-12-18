import {
  CUGLNode,
  CUGLBaseNode,
  CUGLChildrenMixin,
  CUGLWidget,
  OutputFormat,
} from "../types";
import { genFrame } from "./frame";
import { genLabel } from "./label";
import { genRectangle } from "./rectangle";
import { genTextField } from "./textField";

export let imageHashMap = new Map<string, string>();

export async function generateNode(node: SceneNode): Promise<CUGLNode> {
  const parent = node.parent as SceneNode;
  switch (node.type) {
    case "TEXT":
      if (node.name.toLowerCase().startsWith("[textfield]")) {
        return genTextField(node, parent);
      } else {
        return genLabel(node, parent);
      }
    case "FRAME":
      return genFrame(node, parent);
    case "RECTANGLE":
      let code = await genRectangle(node, parent);
      if (code) {
        return code;
      }
    case "COMPONENT":
    case "INSTANCE":
    default:
      throw new Error(
        `${node.name} with type ${node.type} is not explicitly supported`,
      );
    // return genDefault(node, parent);
  }
}

export function generateTextures(): string {
  const textures: Record<string, { file: string }> = {};
  for (const texture of imageHashMap.values()) {
    textures[texture] = { file: "textures/[filename].png" };
  }
  imageHashMap.clear();
  return JSON.stringify({ textures }, null, 2);
}

export function genDefault(node: SceneNode, parent: SceneNode) {
  let defaultCode: CUGLBaseNode & CUGLChildrenMixin = {
    type: "Node",
    data: {
      anchor: [0, 0],
      size: [node.width, node.height],
      scale: 1,
      angle: 0,
      position: [node.x, parent.height - node.y],
      visible: true,
    },
    children: {},
  };
  return defaultCode;
}

const getOutputFormat = () => {
  return figma.codegen.preferences.customSettings.outputFormat as OutputFormat;
};

export const generate = async (
  node: SceneNode,
): Promise<CUGLNode | CUGLWidget> => {
  let cuglNode = await generateNode(node);
  switch (getOutputFormat()) {
    case "node":
      return cuglNode;
    case "widget":
      return {
        variables: {},
        contents: cuglNode,
      };
    default:
      throw new Error("invalid output format");
  }
};
