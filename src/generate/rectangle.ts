import { CUGLImageNode, CUGLNinePatchNode } from "../types";
import { imageHashMap } from "./index";

export async function genRectangle(node: RectangleNode, parent: SceneNode) {
  if (node.fills !== figma.mixed && node.fills?.[0]?.type === "IMAGE") {
    const imageFill = node.fills[0];
    const imageHash = imageFill.imageHash!;
    let texture = node.name;

    let scale = 1;
    if (imageFill.scaleMode === "TILE" && imageFill.scalingFactor) {
      scale = imageFill.scalingFactor;
    } else {
      try {
        const image = figma.getImageByHash(imageHash);
        // this needs to be called first for getSizeAsync to work (bug?)
        await image?.getBytesAsync();
        const originalSize = await image?.getSizeAsync();
        if (originalSize) {
          const widthScale = node.width / originalSize.width;
          const heightScale = node.height / originalSize.height;
          scale = Math.min(widthScale, heightScale);
        }
      } catch (_) {}
    }

    var imageCode: CUGLNinePatchNode | CUGLImageNode;
    const ninepatchMatch = node.name.match(/\[ninepatch\](.*)/i);
    if (ninepatchMatch) {
      texture = ninepatchMatch[1].trim();
      imageCode = {
        type: "Nine",
        data: {
          texture,
          interior: [-1, -1, -1, -1],
          anchor: [0, 0],
          // size: [node.width, node.height],
          scale,
          angle: 0,
          position: parent.height
            ? [node.x, parent.height - node.height - node.y]
            : [0, 0],
          visible: true,
        },
      };
    } else {
      imageCode = {
        type: "Image",
        data: {
          texture,
          anchor: [0, 0],
          // size: [node.width, node.height],
          scale,
          angle: 0,
          position: parent.height
            ? [node.x, parent.height - node.height - node.y]
            : [0, 0],
          visible: true,
        },
      };
    }

    if (imageHashMap.has(imageHash)) {
      texture = imageHashMap.get(imageHash)!;
    } else {
      imageHashMap.set(imageHash, texture);
    }

    return imageCode;
  }
}
