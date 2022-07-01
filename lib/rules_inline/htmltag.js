// Process html tags

import void_names from '../common/html_voids';
import { open_tag, close_tag, attribute } from '../common/html_re';
import { getAttrs } from '../common/html_fns';


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}

export default function htmltag(state, silent) {
  var ch, max, found,
    match_open,
    match_close,
    tag_name,
    pos_after_open_tag,
    pos_after_close_tag,
    self_closing,
    start = state.pos,
    pos = state.pos;

  if (!state.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (!isLetter(ch)) {
    return false;
  }

  // Look for an open tag.
  match_open = state.src.slice(pos).match(open_tag);

  if (!match_open) { return false; }

  // Tag name. "<span>" -> "span"
  tag_name = match_open[1];

  pos_after_open_tag = state.pos + match_open[0].length;

  state.pos = pos_after_open_tag;

  // Is the open tag self-closing?
  self_closing = void_names[tag_name] || match_open[0].match(/<[A-Za-z][A-Za-z0-9]*.*\s*\/>/);

  if (!silent && self_closing) {
    state.push({
      type: 'htmltag',
      tag_name: tag_name,
      attrs: getAttrs(match_open[0]),
      level: state.level
    });
    return true;
  }

  // Not a self-closing tag, start looking for the closing tag.
  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) !== 0x3C /* < */ ||
        state.src.charCodeAt(state.pos + 1) !== 0x2F /* / */ ||
        state.pos + 2 >= max) {
      state.parser.skipToken(state);
    } else {
      match_close = state.src.slice(state.pos).match(close_tag);
      if (match_close && match_close[1] === tag_name) {
        found = true;
        break;
      } else { state.parser.skipToken(state); }
    }
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid htmltag
    state.pos = start;
    return false;
  }

  pos = state.pos
  pos_after_close_tag = pos + match_close[0].length;

  // found!
  state.posMax = pos;
  state.pos = pos_after_open_tag;

  if (!silent) {
    state.push({
      type: 'htmltag_open',
      tag_name: tag_name,
      attrs: getAttrs(match_open[0]),
      level: state.level++
    });
    state.parser.tokenize(state);
    state.push({
      type: 'htmltag_close',
      level: --state.level
    });
  }
  state.pos = pos_after_close_tag;
  state.posMax = max;
  return true;
};
