import {shallow} from "enzyme";
import * as React from "react";
import {Footer} from "../shared-components/Footer/Footer";
import {Root} from "./Root";

it("should render footer", () => {
  const renderedProvider = shallow(<Root />).contains(<Footer />);
  expect(renderedProvider).toBeTruthy();
});
