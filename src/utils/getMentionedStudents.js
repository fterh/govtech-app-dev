/**
 * Extracts and returns an array of mentioned students from a notification.
 * @param {string} notification 
 */
function getMentionedStudents(notification) {
  const regex = /@.+?( |$)/g;
  const matches = notification.match(regex) || []; // Empty array if no matches
  let res = [];
  
  matches.forEach(match => {
    match = match.slice(1); // Remove "@" symbol
    match = match.trim(); // Remove whitespace
    res.push(match)
  });

  return res;
}

module.exports = getMentionedStudents;
