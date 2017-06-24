import { Component, createElement } from "react";
import { elements } from "../../libs/elements";

const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

const header = h1(null, "Yo Bro!");

const container = div(
    null,
    [
        header
    ]);

class Test extends Component<{}, {}> {
    render() {
        return container;
    }
}

export default Test;