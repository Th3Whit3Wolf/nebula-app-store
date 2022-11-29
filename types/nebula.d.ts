import { JSX } from "solid-js";

declare module Nebula {
  interface AppInformation {
    name: string;
    description: string;
    path: string;
    image: () => JSX.Element;
  }
}

export as namespace Nebula;
export = Nebula;
