import { open_tag, close_tag, attribute } from './html_re';

export function getAttrs(element_string) {
  // element_string is a string that looks like "<span foo='bar'>"
  try { // Older versions of Safari don't have .matchAll
    let attrs = {};
    const attrs_matches = [...element_string.matchAll(new RegExp(attribute, 'g'))]
    attrs_matches.forEach(function(match) {
      //  match[1] -> attr_name
      //  match[2] -> attr_val unquoted
      //  match[3] -> attr_val single_quoted
      //  match[4] -> attr_val double_quoted
      let val = match[2] === undefined
        ? match[3] === undefined
          ? match[4]
          : match[3]
        : match[2]
      // undefined attr_val -> value-less attribute, assign to true.
      attrs[match[1]] = val === undefined ? true : val;
    })
    return attrs
  } catch (err) { console.error(err); return {}; }
}

