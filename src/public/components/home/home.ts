import { createElement, SFC } from "react";
import { elements, setElemChildrenCurry } from "../../libs/elements/elements";

const div = elements.div;
const h1 = elements.h1;
const p = elements.p;

const COS_HOME_DIV = setElemChildrenCurry(div, null);
const COS_HOME_HEADER_LEAF = h1(null, "Welcome to CoS!");
const COS_HOME_WELCOME_PARAGRAPH_LEAF = p(null, `This is the CoS prototype.
 You're visiting this site way before almost anybody else in the general public will.`);
const COS_HOME_DETAILS_PARAGRAPH_LEAF = p(null, `Feel free to explore and we
 do have some actual graffiti you can look at but we don't recommend rating
 anything for a little while until we have the release polished (and that's
 probably going to take us a few months). You can register if you like but
 your account info is likely to be deleted in the near future.`);

const Home: SFC<{}> = () => {

    return COS_HOME_DIV([
        COS_HOME_HEADER_LEAF,
        COS_HOME_WELCOME_PARAGRAPH_LEAF,
        COS_HOME_DETAILS_PARAGRAPH_LEAF,
    ]);
};

export default Home;
