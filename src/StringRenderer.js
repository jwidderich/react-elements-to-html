export default class StringRenderer {

  constructor(indentWith) {
    this.indentWith = indentWith;
    this.indentCache = {};
    this.indentCache[0] = '';
  }

  indent(indentDepth) {
    if(this.indentCache[indentDepth] !== undefined) {
      return this.indentCache[indentDepth];
    }
    this.indentCache[indentDepth] = this.indent(indentDepth - 1) + this.indentWith;
    return this.indentCache[indentDepth];
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

  renderString(string, indentDepth) {
    return this.indent(indentDepth) + string + '\n';
  }

  renderInline(tag, attributes, content, indentDepth) {
    return this.indent(indentDepth) +
      this.buildOpeningTag(tag, attributes) +
      content +
      this.buildClosingTag(tag) + '\n';
  }

  renderEmpty(tag, attributes, isSelfClosingTag, indentDepth) {
    return this.indent(indentDepth) + this.buildOpeningTag(tag, attributes) +
      (isSelfClosingTag ? '' : this.buildClosingTag(tag)) + '\n';
  }

  render(tag, attributes, content, indentDepth) {
    return this.indent(indentDepth) + this.buildOpeningTag(tag, attributes) + '\n' +
      content +
      this.indent(indentDepth) + this.buildClosingTag(tag) + '\n';
  }

}
