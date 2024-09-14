import {
  helloVoid,
  helloError,
  helloStr,
  helloNum,
  helloArrayStr,
  helloObj,
} from "../utils/samples";

import { importPNG } from "./aeft-utils";

export { helloError, helloStr, helloNum, helloArrayStr, helloObj, helloVoid, importPNG };
import { dispatchTS } from "../utils/utils";

export const helloWorld = () => {
  alert("Hello from After Effects!");
  app.project.activeItem;
};
