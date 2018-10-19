import * as React from "react";
import {render} from "react-dom";
import {Root} from "./components/Root";

import "../firebase";
import "./style.css";

render(<Root/>, document.getElementById("root"));
