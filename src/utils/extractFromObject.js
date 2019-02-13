/**
 * Extracts a value from a Javascript object by key.
 * Throws an error if key doesn't exist.
 */
function extractFromObject(key, obj) {
  if (!(key in obj)) {
    throw Error("`key` not in `obj`");
  }

  return obj[key];
}

module.exports = extractFromObject;
