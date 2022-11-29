import { createStore } from "solid-js/store";
import {
  defaultAntennaData,
  defaultRxData,
  defaultSignalData,
  defaultTxData,
  defaultUserData,
} from "./constants";
export const [appState, setAppState] = createStore({
  ewok: {},
  antenna: defaultAntennaData,
  rx: defaultRxData,
  signal: defaultSignalData,
  tx: defaultTxData,
  user: defaultUserData,
});
