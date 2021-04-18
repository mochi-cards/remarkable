// Process html tags

import { open_tag, close_tag } from '../common/html_re';


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

  match_open = state.src.slice(pos).match(open_tag).filter(function(m) { return m; });
  tag_name = match_open[1];

  if (!match_open) { return false; }

  pos_after_open_tag = state.pos + match_open[0].length;
  state.pos = pos_after_open_tag;

  while (state.pos < max) {
    if (state.src.charCodeAt(state.pos) !== 0x3C /* < */ ||
        state.src.charCodeAt(state.pos + 1) !== 0x2F /* / */ ||
        state.pos + 2 >= max) {
      state.parser.skipToken(state);
    } else {
      match_close = state.src.slice(state.pos).match(close_tag);
      if (match_close[1] === tag_name) {
        found = true;
        break;
      } else { state.parser.skipToken(state); }
    }
  }

  if (!found) {
    // parser failed to find ending tag, so it's not valid emphasis
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
      type: 'htmltag',
      tag_name: tag_name,
      attrs: match_open.slice(2),
      content: state.src.slice(start, pos_after_close_tag)
    });
  }
  state.pos = pos_after_close_tag;
  state.posMax = max;
  return true;
};
