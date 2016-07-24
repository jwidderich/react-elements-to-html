import React from 'react';
import StringRenderer from './StringRenderer';
import ReactRenderer from './ReactRenderer';

var SelfclosingTags = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true
}

function isSelfClosingTag(tag) {
  return !!SelfclosingTags[tag];
}

// elements is one or more react elements. React elements are plain objects, of the following
// structure:
// element.type: either
//    1) the html tag name of the element
//    2) the custom React class
// element.children: either
//   1) undefined (the element has no children)
//   2) a string (the element has only a text child)
//   3) an array of elements and strings
function elementsToHtmlString(elements, renderer, indent='', indentWith='  ') {

  if(!elements) {
    return '';
  }

  elements = Array.isArray(elements) ? elements : [elements];
  return elements.map((element) => {

    // case 1: element is a text child and has one ore more node siblings
    // (this is only the case if the element is one of the children of case 5, othwerwise case 3
    // would have rendered it)
    if(typeof element === 'string') {
      return renderer.renderString(element, indent);
    }

    // case 2: element represents a custom react class. Instantiate it, call its render function
    // and pass the result into this function.
    if(typeof element === 'object' && typeof element.type === 'function') {
      let f = new element.type(element.props);
      let content = elementsToHtmlString(f.render(), renderer, indent, indentWith);
      return content;
    }

    // case 3: element has only text as a child. Render like so:
    // <div class="element">Some Text</div>
    if(typeof element.props.children === 'string') {
      return renderer.renderInline(element.type, convertProps(element.props), element.props.children, indent)
    }

    // case 4: element has no children. It's either empty or a self closing tag. Render like so:
    // <div class="element"></div>
    // or
    // <img class="element">
    if(typeof element.props.children === 'undefined') {
      return renderer.renderEmpty(element.type, convertProps(element.props), isSelfClosingTag(element.type), indent)
    }

    // case 5: element has at least one child that is a node. Render like so:
    // <div class="element">
    //   <img src="foo.jpg">
    //   Some Text
    // </div>
    let nextIndent = indent + indentWith;
    let content = elementsToHtmlString(element.props.children, renderer, nextIndent, indentWith);
    return renderer.render(element.type, convertProps(element.props), content, indent);
  }).join("");
}

function convertProps(reactProps) {
  var attributes = [];
  for(let key in reactProps) {
    if(key === 'className') {
      attributes.push({'key': 'class', 'value': reactProps.className});
    }
    else if(key === 'style') {
      attributes.push({'key': 'style', 'value': buildStyleString(reactProps.style)});
    }
    else if(key === 'children') {
      // children is a React specific attribute that must not be added to the Node attributes
    }
    else {
      attributes.push({'key': key.toLowerCase(), 'value': reactProps[key]});
    }
  }
  return attributes;
}

function buildStyleString(styleObject) {
  var styles = [];
  for(let attr in styleObject) {
    let value = styleObject[attr];
    attr = attr.replace(/[A-Z]/g, (match) => { return "-" + match.toLowerCase(); });
    if(value.toString().match(/\d+(\.\d+)?/)) {
      value = value + "px";
    }
    styles.push(attr + ': ' + value);
  }
  return styles.join("; ");
}

function convert(elements, indentWith='  ') {
  var renderer = new StringRenderer();
  return elementsToHtmlString(elements, renderer, '', indentWith).trim();
}

export default convert;
