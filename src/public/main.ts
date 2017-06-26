// Remember to rename the file from app.ts to app.tsx
// and to keep it in the src/ directory.

import { createElement } from "react";
import { render } from "react-dom";
import MainIndex from "./components/index";

// Setting MainIndex as any to bypass highlight warning. Should fix this.
render(createElement(MainIndex as any, null, null),
  document.getElementById("react-test"));
