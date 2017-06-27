import { createElement as e, DOMElement, ReactNode } from "react";

/**
 * List of elements to curry. List compiled by react-hyperscript-helpers library
 * https://github.com/jador/react-hyperscript-helpers
 */
const TAG_NAMES = [
    "a", "abbr", "address", "area", "article", "aside", "audio", "b", "base", "bdi", "bdo",
    "big", "blockquote", "body", "br", "button", "canvas", "caption", "cite", "code", "col",
    "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt",
    "em", "embed", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4",
    "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input", "ins",
    "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "menu", "menuitem",
    "meta", "meter", "nav", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param",
    "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select",
    "small", "source", "span", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td",
    "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "u", "ul", "video",
    "wbr", "circle", "clipPath", "defs", "ellipse", "g", "image", "line", "linearGradient", "mask",
    "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "svg", "text",
    "tspan",
];

type ElementCurryFunction = (props?: any, ...children: ReactNode[]) => DOMElement<any, Element>;
type SetElementChildrenCurryFunction = (...children: ReactNode[]) => DOMElement<any, Element>;

/**
 * Use this to map elements to their correct curry function.
 */
interface IElementCurryFunctionMap {
    [selector: string]: (props?: any, ...children: ReactNode[]) => DOMElement<any, Element>;
}

/**
 * Creates a curry function for the ReactJS 'crateElement' function so that
 * instead of needing to call 'crateElement(selector, props, children)' the
 * selector itself can be used as the function and given props and children.
 *
 * For instance running:
 *
 * createElementCurry("h1");
 * createElementCurry("p");
 *
 * Allows for this:
 *
 * createElement("h1", {
 *     id: "some-header",
 *     className: "someclass"}, [
 *         "This is a header"
 *         createElement("p", {id: "some-paragraph"}, "This is a paragraph"),
 *     ]);
 *
 * To become this:
 *
 * h1({ id: "some-header", className: "someclass"}, [
 *     "some-header",
 *     p({id: "some-paragraph"}, "This is a paragraph")]);
 *
 * @param selector -  The selector to create a curry function for.
 *
 * @returns - A new curry function for crearing a React element.
 */
const createElementCurry = (selector: string): ElementCurryFunction => {
    return (props?: any, ...children: ReactNode[]): DOMElement<any, Element> => {
        return e(selector, props, children);
    };
};

/**
 * Generates all of the needed element currys from the 'TAG_NAMES' array.
 *
 * TO-DO: Isn't able to generate proper function for 'input' tag since a
 *        null paramter for children is still treated as a child. Try and fix
 *        this in the future.
 *
 * @returns - A map of curry functions for all elements contained in TAG_NAMES
 */
const generateElements = (): IElementCurryFunctionMap => {
    return TAG_NAMES.reduce((elementsObject: any, tagName: string) => {
        elementsObject[tagName] = createElementCurry(tagName);
        return elementsObject;
    }, {});
};

/**
 * Use this to generate a curry function to set the children of the element
 * produced by a given ElementCurryFunction.
 *
 * @param elemCurry - The ElementCurryFunction used to create the element with
 *      the children and props appended.
 * @param props - The props to pass on to the generated element.
 *
 * @returns - Curry function which allows for an elements children to be set.
 */
export const setElemChildrenCurry =
    (elemCurry: ElementCurryFunction, props?: any): SetElementChildrenCurryFunction => {
        return (...children: ReactNode[]) => {
            return elemCurry(props, children);
        };
    };

export const elements = generateElements();
