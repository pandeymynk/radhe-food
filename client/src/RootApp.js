import React, { useState } from "react";
import Splash from "./Splash";
import App from "./App";

function RootApp() {
  const [showSplash, setShowSplash] = useState(true);
  return showSplash ? (
    <Splash onFinish={() => setShowSplash(false)} />
  ) : (
    <App />
  );
}

export default RootApp;
