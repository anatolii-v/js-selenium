function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/** 
 * @param {string} fileName
 * @returns {string}
 */
function uniteAndTtrimExtention(fileName) {
  // remove extension
  const base = fileName.replace(/\.[^/.]+$/, '');
  // split by spaces, lowercase first word, capitalize others
  const parts = base.trim().split(/\s+/);
  return parts.map((word, i) => i === 0
              ? word.charAt(0).toLowerCase() + word.slice(1)
              : word.charAt(0).toUpperCase() + word.slice(1)
    ).join('');
}
module.exports = { capitalizeFirstLetter, uniteAndTtrimExtention };