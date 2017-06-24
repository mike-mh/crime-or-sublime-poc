import { Component, createElement } from "react";
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import { elements } from "../libs/elements";
import Navbar from "./navbar/navbar";
import { sessionReducer } from "../reducers/session-management/session.reducer"

const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

const header = h1(null, "Welcome to CoS!");
const store = createStore(sessionReducer);

const entryPoint = createElement(Provider,
    { store },
    div({id: "cos"}, [
        header,
        createElement(Navbar, null, null)
        ]));

class Index extends Component<{}, {}> {
    render() {
        return entryPoint;
    }
}

export default Index;