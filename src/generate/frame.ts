import { generateNode } from ".";
import {
  CUGLBaseNode,
  CUGLNode,
  CUGLFloatLayoutMixin,
  CUGLChildrenMixin,
  CUGLAnchoredLayoutMixin,
} from "../types";
import {
  convertXAlign,
  convertYAlign,
  convertLayoutMode,
  convertXAnchor,
  convertYAnchor,
} from "../util";
import { genButton } from "./button";

export async function genFrame(node: FrameNode, parent: SceneNode) {
  if (node.name.toLowerCase().startsWith("[button]")) {
    // NOTE: For Buttons, ..., ... students need to make a Figma component and use instances of it
    console.log("Button detected");
    return genButton(node, parent);
  } else {
    if (node.layoutMode != "NONE") {
      const spacer: CUGLBaseNode = {
        type: "Node",
        data: {
          size:
            node.layoutMode === "HORIZONTAL"
              ? [node.itemSpacing, 0]
              : [0, node.itemSpacing],
        },
      };
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
      generatedChildren
        .flatMap((genResult, index) => {
          return index !== 0
            ? [{ name: "spacer", node: spacer }, genResult]
            : genResult;
        })
        .forEach(({ name, node }, index) => {
          children[`${name}_${index.toString()}`] = {
            ...node,
            layout: {
              priority: index,
            },
          };
        });

      const frameCode: CUGLBaseNode & CUGLChildrenMixin & CUGLFloatLayoutMixin =
        {
          type: "Node",
          format: {
            type: "Float",
            x_alignment: convertXAlign(
              node.layoutMode === "HORIZONTAL"
                ? node.primaryAxisAlignItems
                : node.counterAxisAlignItems,
            ),
            y_alignment: convertYAlign(
              node.layoutMode === "HORIZONTAL"
                ? node.counterAxisAlignItems
                : node.primaryAxisAlignItems,
            ),
            orientation: convertLayoutMode(node.layoutMode),
          },
          data: {
            anchor: [0, 0],
            size: [node.width, node.height],
            scale: 1,
            angle: 0,
            position: parent.height ? [node.x, parent.height - node.y] : [0, 0],
            visible: true,
          },
          children: children,
        };
      return frameCode;
    } else {
      type ChildType = CUGLNode & CUGLAnchoredLayoutMixin["children"]["key"];
      const absolute = false; // TODO: Support toggling absolute via config
      const convertChild = async (child: SceneNode): Promise<ChildType> => {
        const parent = child.parent as SceneNode;
        const constraints =
          "constraints" in child ? child.constraints : undefined;
        const [anchor_x, x_anchor] = convertXAnchor(constraints?.horizontal);
        const [anchor_y, y_anchor] = convertYAnchor(constraints?.vertical);
        const cuglChild = await generateNode(child);
        cuglChild.data.anchor = [anchor_x, anchor_y];
        let [x_offset, y_offset] = cuglChild.data.position || [0, 0];
        switch (x_anchor) {
          case "center":
            x_offset += child.width / 2;
            x_offset -= parent.width / 2;
            break;
          case "right":
            x_offset += child.width;
            x_offset -= parent.width;
            break;
          case "left":
          case "fill":
            break;
        }
        switch (y_anchor) {
          case "middle":
            y_offset += child.height / 2;
            y_offset -= parent.height / 2;
            break;
          case "top":
            y_offset += child.height;
            y_offset -= parent.height;
            break;
          case "bottom":
          case "fill":
            break;
        }
        if (!absolute) {
          x_offset /= parent.width;
          y_offset /= parent.height;
        }
        return {
          ...cuglChild,
          layout: {
            x_anchor,
            y_anchor,
            absolute,
            x_offset,
            y_offset,
          },
        };
      };
      const children: Record<string, ChildType> = {};
      const generatedChildren = await Promise.all(
        node.children.map(async (child) => ({
          name: child.name,
          node: await convertChild(child),
        })),
      );
      generatedChildren.forEach(({ name, node }, index) => {
        children[`${name}_${index.toString()}`] = node;
      });
      let defaultCode: CUGLBaseNode &
        CUGLChildrenMixin &
        CUGLAnchoredLayoutMixin = {
        type: "Node",
        format: {
          type: "Anchored",
        },
        data: {
          anchor: [0, 0],
          size: parent.height ? [node.width, node.height] : undefined,
          position: parent.height
            ? [node.x, parent.height - node.height - node.y]
            : [0, 0],
          visible: true,
        },
        children,
      };
      return defaultCode;
    }
  }
}
