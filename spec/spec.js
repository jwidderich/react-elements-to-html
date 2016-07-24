import React from 'react';
import Convert from '../src/convert.js';
import ReactDOMServer from 'react-dom/server';

var elements_1 = (<div>FOO</div>);
var html_1 = `<div>FOO</div>`

var elements_2 = (<div><a>FOO</a></div>);
var html_2 =
`<div>
  <a>FOO</a>
</div>`

var elements_3 = (<div><br/>FOO</div>);
var html_3 =
`<div>
  <br>
  FOO
</div>`

var elements_4 = (<div><br/>FOO<img/></div>);
var html_4 =
`<div>
  <br>
  FOO
  <img>
</div>`

var elements_5 = (<div>FOO<img/></div>);
var html_5 =
`<div>
  FOO
  <img>
</div>`

var elements_6 = (<div><img/></div>);
var html_6 =
`<div>
  <img>
</div>`

var elements_7 = (<div className="foo bar"><a className="lol">FOO</a></div>);
var html_7 =
`<div class="foo bar">
  <a class="lol">FOO</a>
</div>`

var elements_8 = (<div style={{backgroundColor: 'blue', marginRight: 10}}><a>FOO</a></div>);
var html_8 =
`<div style="background-color: blue; margin-right: 10px">
  <a>FOO</a>
</div>`

var elements_9 = (<div></div>);
var html_9 = `<div></div>`

class SomeComponent extends React.Component {

  render() {
    return (<div>Some Text<img src={this.props.src}/></div>);
  }

}

var elements_10 = (<div><input /><SomeComponent src="foo.jpg" />Another Text</div>);
var html_10 =
`<div>
  <input>
  <div>
    Some Text
    <img src="foo.jpg">
  </div>
  Another Text
</div>`

//console.log(ReactDOMServer.renderToStaticMarkup(elements_10))

describe("react elements to html", () => {
  it("converts a simple structure", () => {
    expect(Convert(elements_1)).toEqual(html_1);
    expect(Convert(elements_2)).toEqual(html_2);
    expect(Convert(elements_9)).toEqual(html_9);
  });

  it("handles self closing tags correctly", () => {
    expect(Convert(elements_3)).toEqual(html_3);
    expect(Convert(elements_4)).toEqual(html_4);
    expect(Convert(elements_5)).toEqual(html_5);
    expect(Convert(elements_6)).toEqual(html_6);
  });

  it("converts the className attribute to class", () => {
    expect(Convert(elements_7)).toEqual(html_7);
  });

  it("converts the style object to css styles", () => {
    expect(Convert(elements_8)).toEqual(html_8);
  });

  it("converts nested react components correctly", () => {
    expect(Convert(elements_10)).toEqual(html_10);
  });

});
