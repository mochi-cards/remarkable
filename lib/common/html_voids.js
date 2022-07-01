// List of valid void element names.

var html_voids = {};

[
  
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
].forEach(function (name) { html_voids[name] = true; });


export default html_voids;
