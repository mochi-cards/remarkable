import assert from 'assert';
import { Remarkable } from '../lib/index';

var md = new Remarkable('full', { html: true, breaks: true });
const output1 = md.parse(
  "Lorem ipsum <span bix foo=\"bar\" bizz='bazz' boo=bee>dolor <cite>sit</cite></span> amet.",
  {}
);
const output2 = md.parse(
  "Lorem ipsum <br foo=bar />dolor.",
  {}
);
describe('self-closing inline html tags', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      output2[1]['children'],
      [
        { type: 'text', content: 'Lorem ipsum ', level: 0 },
        {
          type: 'htmltag',
          tag_name: 'br',
          attrs: {'foo': 'bar'},
          level: 0
        },
        { type: 'text', content: 'dolor.', level: 0 }
      ]
    );
  })
})
describe('inline html tags with content', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      output1[1]['children'],
      [
        { type: 'text', content: 'Lorem ipsum ', level: 0 },
        {
          type: 'htmltag_open',
          tag_name: 'span',
          attrs: {'bix': true, 'foo': 'bar', 'bizz': 'bazz', 'boo': 'bee'},
          level: 0
        },
        { type: 'text', content: 'dolor ', level: 1 },
        { type: 'htmltag_open', tag_name: 'cite', attrs: {}, level: 1 },
        { type: 'text', content: 'sit', level: 2 },
        { type: 'htmltag_close', level: 1 },
        { type: 'htmltag_close', level: 0 },
        { type: 'text', content: ' amet.', level: 0 }
      ]
    );
  });
});
describe('incomplete closing tag', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      md.parse("Lorem <span>ipsum</s", {})[1]['children'],
      [ { type: 'text', content: 'Lorem <span>ipsum</s', level: 0 } ]
    );
  });
});
