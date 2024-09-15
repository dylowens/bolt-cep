import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";

import { importPNG, compFromFootage } from "./aeft-utils";
import { createBasemapComp } from "./aeft-basemap";
import { dispatchTS } from "../utils/utils";

export { 
  helloError, 
  helloStr, 
  helloNum, 
  helloArrayStr, 
  helloObj, 
  helloVoid, 
  importPNG,
  createBasemapComp 
};

export const helloWorld = () => {
  alert("Hello from After Effects!");
  app.project.activeItem;
};