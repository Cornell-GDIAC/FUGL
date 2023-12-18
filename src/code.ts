// This plugin will generate a sample codegen plugin
// that appears in the Element tab of the Inspect panel.

import { generate, generateTextures } from "./generate";

// This file holds the main code for plugins. Code in this file has access to
// the *figma document* via the figma global object.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (See https://www.figma.com/plugin-docs/how-plugins-run).

// This provides the callback to generate the code.
figma.codegen.on("generate", async (event) => {
  return [
    {
      title: "FUGL Scene",
      code: JSON.stringify(await generate(event.node), null, 2),
      language: "JSON",
    },
    {
      title: "Textures",
      code: generateTextures(),
      language: "JSON",
    },
  ];
});
