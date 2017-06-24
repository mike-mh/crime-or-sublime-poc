// Remember to rename the file from app.ts to app.tsx
// and to keep it in the src/ directory.

import { createElement } from "react";
import { render } from "react-dom";
import Index from "./components/index";

render(createElement(Index, null, null),
  document.getElementById("react-test"));
