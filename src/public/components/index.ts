import { Component, createElement } from "react";
import { elements } from "../libs/elements";
import Navbar from "./navbar/navbar";


const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

const header = h1(null, "Welcome to CoS!");

const container = div(
    null,
    [
        header,
        createElement(Navbar, null, null)
    ]);

class Index extends Component<{}, {}> {
    render() {
        return container;
    }
}

export default Index;