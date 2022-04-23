// HTML block

import block_names from '../common/html_blocks';
import { open_tag, close_tag, attribute } from '../common/html_re';
import { getAttrs } from '../common/html_fns';


var HTML_TAG_OPEN_RE = /^<([a-zA-Z]{1,15})[^>]*>$/;
var HTML_TAG_CLOSE_RE = /^<\/([a-zA-Z]{1,15})[\s>]$/;

function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


export default function htmlblock(state, startLine, endLine, silent) {
  let pos = state.bMarks[startLine] + state.tShift[startLine];
  const max = state.eMarks[startLine];

  if (!state.options.html) { return false; }

  // Not enough chars or ending line with `<x>`.
  if (pos + 3 >= max) return false;

  const marker = state.src.charCodeAt(pos);

  // Wrong marker
  // if (marker !== 0x3a /* ':' */) return false;
  if (marker !== 0x3C/* < */) { return false; }
  // If the next character is not a letter.
  if (!isLetter(state.src.charCodeAt(pos + 1))) { return false; }

  const match = state.src.slice(pos, max).match(HTML_TAG_OPEN_RE);
  if (!match) { return false; }

  // Look for an open tag.
  const match_open = state.src.slice(pos).match(open_tag);

  // Tag name. "<span>" -> "span"
  const tag_name = match_open[1];

  if (silent) return true;

  // Scan for marker ending
  let nextLine = startLine;
  let hasEnding = false;

  while (nextLine < endLine) {
    nextLine++;

    if (nextLine >= endLine) break;

    const nextPos = state.bMarks[nextLine] + state.tShift[nextLine];
    const nextMax = state.eMarks[nextLine];

    if (state.src.charCodeAt(nextPos) !== marker) continue;

    if (!match) { return false; }

    const nextLineText = state.src.slice(nextPos, nextMax).trim();
    if (nextLineText.charCodeAt(0) !== 0x3C/* < */) { continue; }
    if (nextLineText.charCodeAt(1) !== 0x2F/* / */) { continue; }
    const match2 = nextLineText.match(HTML_TAG_CLOSE_RE);
    const match3 = nextLineText.match(close_tag);
    if (match2 && match3[1] === tag_name) {
      hasEnding = true;
      break;
    }
  }

  // Ensure nested parsing stops at delimiting block
  const oldMax = state.lineMax;
  state.lineMax = nextLine + (hasEnding ? -1 : 0);
  const oldParentType = state.parentType;
  state.parentType = 'htmlblock';

  let lines;

  // Let register token and progress
  state.tokens.push({
    type: 'htmlblock_open',
    tag_name: tag_name,
    attrs: getAttrs(match_open[0]),
    level: state.level,
    lines: lines = [startLine, 0],
  });
  state.parser.tokenize(state, startLine + 1, nextLine);
  state.tokens.push({
    type: 'htmlblock_close',
    level: state.level
  });

  // Revert
  lines[1] = nextLine;
  state.line = nextLine + (hasEnding ? 1 : 0);
  state.lineMax = oldMax;
  state.parentType = oldParentType;

  return true;
};
