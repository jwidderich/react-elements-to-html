import React from 'react';

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
// element.type: the html tag name of the element
// element.children: either
//   1) undefined: the element has no children
//   2) a string (the element has only text content)
//   3) an array of elements and strings
function elementsToHtmlString(elements, indent='', indentWith='  ') {
  if(!elements) {
    return '';
  }
  elements = Array.isArray(elements) ? elements : [elements];
  return elements.map((element) => {

    // (1) element is a text child and has one ore more node siblings
    // (this is only the case if the element is one of the children of case (4))
    if(typeof element === 'string') {
      return indent + element + '\n';
    }

    // (2) element has only text as a child. Render like so:
    // <div class="element">Some Text</div>
    if(typeof element.props.children === 'string') {
      return indent +
        buildOpeningTag(element) +
        element.props.children +
        buildClosingTag(element);
    }

    // (3) element has no children. It's either empty or a self closing tag. Render like so:
    // <div class="element"></div>
    // or
    // <img class="element">
    if(typeof element.props.children === 'undefined') {
      return indent +
        buildOpeningTag(element) +
        (isSelfClosingTag(element.type) ? '' : buildClosingTag(element)) + '\n';
    }

    // (4) element has at least one child that is a node. Render like so:
    // <div class="element">
    //   <img src="foo.jpg">
    //   Some Text
    // </div>
    let nextIndent = indent + indentWith;
    return indent + buildOpeningTag(element) + '\n' +
      elementsToHtmlString(element.props.children, nextIndent, indentWith) +
      indent + buildClosingTag(element) + '\n';
  }).join("");
}

function buildOpeningTag(element) {
  var attributes = [];
  for(let key in element.props) {
    if(key === 'className') {
      attributes.push('class="' + element.props.className + '"');
    }
    else if(key === 'style') {
      attributes.push('style="' + buildStyleString(element.props.style) + '"');
    }
    else if(key === 'children') {
      // children is a React specific attribute that must not be added to the Node attributes
    }
    else {
      attributes.push(key.toLowerCase()  + '="' + element.props[key] + '"');
    }
  }
  return '<' + element.type + (attributes.length > 0 ? ' ' : '') + attributes.join(' ') + '>';
}

function buildClosingTag(element) {
  return '</' + element.type + '>\n';
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
  return elementsToHtmlString(elements, '', indentWith).trim();
}

export default convert;
