import { CUGLLabelNode, CUGLChildrenMixin } from "../types";
import { convertTextAlignVertical, convertTextAlignHorizontal } from "../util";

export function genLabel(node: TextNode, parent: SceneNode) {
  // Construct color array for the foreground
  let color = (node.fills as Paint[])[0] as SolidPaint;
  let colorArray: [number, number, number, number] = [
    color.color.r,
    color.color.g,
    color.color.b,
    (color.opacity || 1) * 255,
  ];

  // Construct the padding array by calculating the distance from the edge of the parent
  // TODO: Not sure how to get padding

  let textCode: CUGLLabelNode & CUGLChildrenMixin = {
    // NOTE FOR STUDENTS: To input text fields in Figma, add a text box that says "TextField"
    type: "Label",
    data: {
      anchor: [0, 0],
      size: [node.width, node.height],
      position: parent.height
        ? [node.x, parent.height - node.height - node.y]
        : [0, 0],
      scale: 1,
      angle: 0,
      visible: true,
      font: (node.fontName as FontName).family,
      text: node.characters,
      foreground: colorArray,
      // There is no way to set the background in Figma!
      background: [0, 0, 0, 0],
      // Padding is calculated by offset from the edge Figma
      padding: [0, 0, 0, 0],
      valign: convertTextAlignVertical(node.textAlignVertical),
      halign: convertTextAlignHorizontal(node.textAlignHorizontal),
    },
    children: {},
  };
  return textCode;
}
