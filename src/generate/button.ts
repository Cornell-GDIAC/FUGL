import { generateNode } from ".";
import {
  CUGLNode,
  CUGLFloatLayoutMixin,
  CUGLButtonNode,
  CUGLChildrenMixin,
} from "../types";

export async function genButton(node: FrameNode, parent: SceneNode) {
  const children: Record<
    string,
    CUGLNode & CUGLFloatLayoutMixin["children"]["key"]
  > = {};
  const generatedChildren = await Promise.all(
    node.children.map(async (child) => ({
      name: child.name,
      node: await generateNode(child),
    })),
  );
  generatedChildren.forEach(({ name, node }, index) => {
    children[`${name}_${index.toString()}`] = {
      ...node,
      layout: {
        priority: index,
      },
    };
  });

  let buttonCode: CUGLButtonNode & CUGLChildrenMixin = {
    type: "Button",
    data: {
      anchor: [0, 0],
      size: [node.width, node.height],
      position: parent.height
        ? [node.x, parent.height - node.height - node.y]
        : [0, 0],
      scale: 1,
      angle: 0,
      visible: true,
      upnode: "0",
      downnode: node.children[1] ? "1" : "",
    },
    children: children,
  };
  return buttonCode;
}
