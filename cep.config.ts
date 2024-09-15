import { CEP_Config } from "vite-cep-plugin";
import { version } from "./package.json";
import { debugAll } from "./cep.config.debug"; // BOLT-CEP-DEBUG-ONLY

const config: CEP_Config = {
  version,
  id: "com.bolt.cep",
  displayName: "marble-melon",
  symlink: "local",
  port: 3000,
  servePort: 5000,
  startingDebugPort: 8860,
  extensionManifestVersion: 6.0,
  requiredRuntimeVersion: 9.0,
  hosts: [
    { name: "AEFT", version: "[0.0,99.9]" },
    { name: "AME", version: "[0.0,99.9]" },
    { name: "AUDT", version: "[0.0,99.9]" },
    { name: "FLPR", version: "[0.0,99.9]" },
    { name: "IDSN", version: "[0.0,99.9]" },
    { name: "ILST", version: "[0.0,99.9]" },
    { name: "KBRG", version: "[0.0,99.9]" },
    { name: "PHXS", version: "[0.0,99.9]" },
    { name: "PPRO", version: "[0.0,99.9]" },
  ],

  type: "Embedded",
  iconDarkNormal: "./src/assets/light-icon.png",
  iconNormal: "./src/assets/dark-icon.png",
  iconDarkNormalRollOver: "./src/assets/light-icon.png",
  iconNormalRollOver: "./src/assets/dark-icon.png",
  parameters: ["--v=0", "--enable-nodejs", "--mixed-context"],
  width: 300,
  height: 500,

  panels: [
    {
      mainPath: "./main/index.html",
      name: "main",
      panelDisplayName: "Marble Melon",
      autoVisible: true,
      width: 600,
      height: 650,
    },
    ...debugAll, // BOLT-CEP-DEBUG-ONLY
  ],
  build: {
    jsxBin: "off",
    sourceMap: true,
  },
  zxp: {
    country: "US",
    province: "CA",
    org: "MyCompany",
    password: "mypassword",
    tsa: "http://timestamp.digicert.com/",
    sourceMap: false,
    jsxBin: "off",
  },
  installModules: [],
  copyAssets: [],
  copyZipAssets: [],
};
export default config;
