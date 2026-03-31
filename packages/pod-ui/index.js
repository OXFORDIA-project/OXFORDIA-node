import React from "react";
import { registerRootComponent } from "expo";
import { Screen } from "./app/index";

export function App() {
  return <Screen />;
}

registerRootComponent(App);
