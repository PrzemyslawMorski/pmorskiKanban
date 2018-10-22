import {shallow} from "enzyme";
import * as React from "react";
import {Navbar} from "../shared-components/Navbar/Navbar";
import {Root} from "./Root";

it("should render footer", () => {
  const renderedProvider = shallow(<Root />).contains(<Navbar />);
  expect(renderedProvider).toBeTruthy();
});
