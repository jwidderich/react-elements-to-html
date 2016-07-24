export default class StringRenderer {

  constructor() {
  }

  buildAttributes(attributes) {
    return attributes.map((pair) => pair.key + '="' + pair.value + '"').join(" ");
  }

  buildOpeningTag(tag, attributes) {
    return '<' + tag + (attributes.length > 0 ? ' ' : '') + this.buildAttributes(attributes) + '>';
  }

  buildClosingTag(tag) {
    return '</' + tag + '>';
  }

  renderString(string, indent) {
    return indent + string + '\n';
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
