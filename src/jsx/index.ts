// @include './lib/json2.js'

import { ns } from "../shared/shared";

import * as aeft from "./aeft/aeft";

//@ts-ignore
const host = typeof $ !== "undefined" ? $ : window;

// A safe way to get the app name since some versions of Adobe Apps broken BridgeTalk in various places (e.g. After Effects 24-25)
// in that case we have to do various checks per app to determine the app name

function getAppNameSafely() {
  function compare(a: string, b: string): boolean {
    return a.toLowerCase().indexOf(b.toLowerCase()) > -1;
  }
  function exists(a: unknown): boolean {
    return typeof a !== "undefined";
  }
  var isBridgeTalkWorking =
    typeof BridgeTalk !== "undefined" &&
    typeof BridgeTalk.appName !== "undefined";

  if (isBridgeTalkWorking) {
    return BridgeTalk.appName;
  } else if (app) {
    if (exists((app as any).appName)) {
      var appName = (app as any).appName;
      if (compare(appName, "after effects")) return "aftereffects";
    }
  }
  return "unknown";
}

switch (getAppNameSafely()) {
  case "aftereffects":
  case "aftereffectsbeta":
    host[ns] = aeft;
    break;
}

// Type definitions (these won't be included in the compiled JS)
/*
type Scripts = typeof aeft;

type ApplicationName =
  | "aftereffects"
  | "aftereffectsbeta";
*/