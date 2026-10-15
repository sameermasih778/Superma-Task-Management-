/**
 * Normalise escaped line breaks in display text.
 *
 * Some admin fields are single-line inputs (the changelog "Banner title", for
 * example), so an editor cannot press Enter to break a line - they type the two
 * characters `\` and `n` instead. Stored verbatim, that renders on the public
 * pages as the literal text "\n" instead of a line break.
 *
 * The banner headings are rendered with `whitespace-pre-line`, so turning the
 * escaped form back into a real newline is all that is needed. A value that
 * already contains real newlines is returned untouched.
 *
 * Apply this to heading fields only - in free text a real backslash is content.
 */
export const withLineBreaks = (value) =>
  String(value ?? '').replace(/\\r\\n|\\n/g, '\n');
