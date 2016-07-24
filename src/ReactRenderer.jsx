import ReactDom from 'react-dom';

export default class ReactRenderer {

  constructor() {
  }

  buildAttributes(attributes) {
    return attributes.map((attribute) => {

    })
  }

  buildOpeningTag(tag, attributes) {
    return(<div className="Html-line">
      <span>&lt;</span>
      <span className="Html-tag Html-tag--opening">{tag}</span>
      {buildAttributes(attributes)}
      <span>&gt;</span>
    </div>)
    return '<' + tag + (attributes.length > 0 ? ' ' : '') + attributes.join(' ') + '>';
  }

  buildClosingTag(tag) {
    return '</' + tag + '>';
  }

  renderString(content, indent) {
    return(<div className="Html-text">{content}</div>)
  }

  renderInline(tag, attributes, content, indent) {
    return indent +
      this.buildOpeningTag(tag, attributes) +
      content +
      this.buildClosingTag(tag) + '\n';
  }

  renderEmpty(tag, attributes, isSelfClosingTag, indent) {
    return indent + this.buildOpeningTag(tag, attributes) +
      (isSelfClosingTag ? '' : this.buildClosingTag(tag)) + '\n';
  }

  render(tag, attributes, content, indent) {
    return indent + this.buildOpeningTag(tag, attributes) + '\n' +
      content +
      indent + this.buildClosingTag(tag) + '\n';
  }

}
