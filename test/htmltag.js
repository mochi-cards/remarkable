import assert from 'assert';
import { Remarkable } from '../lib/index';
const util = require('util')

var md = new Remarkable('full', { html: true, breaks: true });
const output1 = md.parse(
  "Lorem ipsum <span bix foo=\"bar\" bizz='bazz' boo=bee>dolor <cite>sit</cite></span> amet.",
  {}
);
const output2 = md.parse(
  "Lorem ipsum <br foo=bar />dolor.",
  {}
);
const output3 = md.parse(
  "<div>\nLorem ipsum\n</div>\nfoo",
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
describe('block html tag with content', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      output3,
      [
        {
          type: 'htmlblock_open',
          tag_name: 'div',
          attrs: {},
          level: 0,
          lines: [ 0, 2 ]
        },
        { type: 'paragraph_open', tight: false, lines: [ 1, 2 ], level: 0 },
        {
          type: 'inline',
          content: 'Lorem ipsum',
          level: 1,
          lines: [ 1, 2 ],
          children: [
            {
              content: "Lorem ipsum",
              level: 0,
              type: "text",
            }
          ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        { type: 'htmlblock_close', level: 0 },
        { type: 'paragraph_open', tight: false, lines: [ 3, 4 ], level: 0 },
        {
          type: 'inline',
          content: 'foo',
          level: 1,
          lines: [ 3, 4 ],
          children: [
            {
              content: "foo",
              level: 0,
              type: "text",
            }
          ]
        },
        { type: 'paragraph_close', tight: false, level: 0 }
      ]
    );
  })
})

const output4 = md.parse(
  "<div>\nLorem ipsum\n\ndoler sit\n</div>",
  {}
);
describe('block html tag with content', function() {
  it('should parse the html as nested structured data', () => {
    // console.log(util.inspect(output4, {showHidden: false, depth: null, colors: true}));
    assert.deepEqual(
      output4,
      [
        {
          type: 'htmlblock_open',
          tag_name: 'div',
          attrs: {},
          level: 0,
          lines: [ 0, 4 ]
        },
        { type: 'paragraph_open', tight: false, lines: [ 1, 2 ], level: 0 },
        {
          type: 'inline',
          content: 'Lorem ipsum',
          level: 1,
          lines: [ 1, 2 ],
          children: [
            {
              content: "Lorem ipsum",
              level: 0,
              type: "text"
            }
          ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        { type: 'paragraph_open', tight: false, lines: [ 3, 4 ], level: 0 },
        {
          type: 'inline',
          content: 'doler sit',
          level: 1,
          lines: [ 3, 4 ],
          children: [
            {
              content: "doler sit",
              level: 0,
              type: "text"
            }
          ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        { type: 'htmlblock_close', level: 0 }
      ]
    );
  })
})

const output5 = md.parse(
  "<div>Lorem ipsum</div>",
  {}
);
describe('block html tag with content', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      output5[0]['children'],
      [
        {
          type: 'htmltag_open',
          tag_name: 'div',
          attrs: {},
          level: 0
        },
        { type: 'text', content: 'Lorem ipsum', level: 1 },
        { type: 'htmltag_close', level: 0 },
      ]
    );
  })
})


const output6 = md.parse(
  "<div foo=\"bar\">\nLorem ipsum\n\n<section>\ndoler sit\n</section>\n</div>",
  {}
);
describe('block html tag with content', function() {
  it('should parse the html as nested structured data', () => {
    assert.deepEqual(
      output6,
      [
        {
          type: 'htmlblock_open',
          tag_name: 'div',
          attrs: { foo: 'bar' },
          level: 0,
          lines: [ 0, 6 ]
        },
        {
          type: 'paragraph_open',
          tight: false,
          lines: [ 1, 2 ],
          level: 0
        },
        {
          type: 'inline',
          content: 'Lorem ipsum',
          level: 1,
          lines: [ 1, 2 ],
          children: [ { type: 'text', content: 'Lorem ipsum', level: 0 } ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        {
          type: 'htmlblock_open',
          tag_name: 'section',
          attrs: {},
          level: 0,
          lines: [ 3, 5 ]
        },
        {
          type: 'paragraph_open',
          tight: false,
          lines: [ 4, 5 ],
          level: 0
        },
        {
          type: 'inline',
          content: 'doler sit',
          level: 1,
          lines: [ 4, 5 ],
          children: [ { type: 'text', content: 'doler sit', level: 0 } ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        { type: 'htmlblock_close', level: 0 },
        { type: 'htmlblock_close', level: 0 },
      ]
    );
  })
})

const output7 = md.parse(
  "<details>\n<summary>Lorem</summary>\nIpsum\n</details>",
  {}
);
describe('block html tag with content', function() {
  it('should parse the html as nested structured data', () => {
    // console.log(util.inspect(output7, {showHidden: false, depth: null, colors: true}));
    assert.deepEqual(
      output7,
      [
        {
          type: 'htmlblock_open',
          tag_name: 'details',
          attrs: {},
          level: 0,
          lines: [ 0, 3 ]
        },
        {
          type: 'inline',
          content: '<summary>Lorem</summary>',
          level: 1,
          lines: [ 1, 2 ],
          children: [
            { type: 'htmltag_open', tag_name: 'summary', attrs: {}, level: 0 },
            { type: 'text', content: 'Lorem', level: 1 },
            { type: 'htmltag_close', level: 0 }
          ]
        },
        { type: 'paragraph_open', tight: false, lines: [ 2, 3 ], level: 0 },
        {
          type: 'inline',
          content: 'Ipsum',
          level: 1,
          lines: [ 2, 3 ],
          children: [ { type: 'text', content: 'Ipsum', level: 0 } ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        { type: 'htmlblock_close', level: 0 }
      ]
    );
  })
})


const output8 = md.parse(
  "foo\n\n<br/>\n\nbar\n\n<hr>foobar<hr>",
  {}
);
describe('Deals with self-closing tags and void elements', function() {
  it('note give children to <br> tags', () => {
    // console.log(util.inspect(output8, {showHidden: false, depth: null, colors: true}));
    assert.deepEqual(
      output8,
      [
        { type: 'paragraph_open', tight: false, lines: [ 0, 1 ], level: 0 },
        {
          type: 'inline',
          content: 'foo',
          level: 1,
          lines: [ 0, 1 ],
          children: [ { type: 'text', content: 'foo', level: 0 } ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        {
          type: 'inline',
          content: '<br/>',
          level: 1,
          lines: [ 2, 3 ],
          children: [ { type: 'htmltag', tag_name: 'br', attrs: {}, level: 0 } ]
        },
        { type: 'paragraph_open', tight: false, lines: [ 4, 5 ], level: 0 },
        {
          type: 'inline',
          content: 'bar',
          level: 1,
          lines: [ 4, 5 ],
          children: [ { type: 'text', content: 'bar', level: 0 } ]
        },
        { type: 'paragraph_close', tight: false, level: 0 },
        {
          type: 'inline',
          content: '<hr>foobar<hr>',
          level: 1,
          lines: [ 6, 7 ],
          children: [
            { type: 'htmltag', tag_name: 'hr', attrs: {}, level: 0 },
            { type: 'text', content: 'foobar', level: 0 },
            { type: 'htmltag', tag_name: 'hr', attrs: {}, level: 0 }
          ]
        }
      ]
    );
  })
})
