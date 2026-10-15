/**
 * Normalise escaped line breaks in stored display text.
 *
 * Single-line admin inputs (the changelog and blog "banner title") cannot hold
 * a real newline, so editors type the two characters `\` and `n` to describe
 * the break. Stored verbatim, that reaches the API as the literal text "\n" and
 * the public pages print it instead of breaking the line.
 *
 * The banner headings render with `whitespace-pre-line`, so turning the escaped
 * form back into a real newline is all that is needed - both on write (so new
 * entries are stored cleanly) and on read (so rows created before this fix are
 * served correctly without rewriting the table).
 */
const withLineBreaks = (value) =>
  (value === null || value === undefined
    ? value
    : String(value).replace(/\\r\\n|\\n/g, '\n'));

module.exports = { withLineBreaks };
