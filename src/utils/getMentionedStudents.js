/**
 * Extracts and returns an array of mentioned students from a notification.
 * @param {string} notification
 */
function getMentionedStudents(notification) {
  const regex = /@.+?( |$)/g;
  const matches = notification.match(regex) || []; // Empty array if no matches
  const res = [];

  matches.forEach(match => {
    const matchSliced = match.slice(1); // Remove "@" symbol
    const matchTrimmed = matchSliced.trim(); // Remove whitespace
    res.push(matchTrimmed);
  });

  return res;
}

module.exports = getMentionedStudents;
