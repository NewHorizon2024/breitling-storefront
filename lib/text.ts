const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

/**
 * Decodes HTML entities in a string. Some records in the source catalog store
 * entity-encoded text (e.g. `At&#38;t smartphone`), and React renders strings
 * verbatim — so without decoding the raw `&#38;` shows up on screen.
 *
 * Handles named entities (`&amp;`, `&quot;`, …) and numeric ones, both decimal
 * (`&#38;`) and hex (`&#x27;`). Unknown entities are left untouched.
 */
export function decodeEntities(input: string): string {
  // Fast path: nothing to decode.
  if (!input.includes("&")) return input;

  return input.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]*);/g, (match, body: string) => {
    if (body[0] === "#") {
      const isHex = body[1] === "x" || body[1] === "X";
      const code = parseInt(body.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (Number.isNaN(code)) return match;
      try {
        return String.fromCodePoint(code);
      } catch {
        return match; // out-of-range code point
      }
    }
    const named = NAMED_ENTITIES[body.toLowerCase()];
    return named ?? match;
  });
}

/** Decodes entities when a value is present, passing through `undefined`. */
export function decodeMaybe<T extends string | undefined>(input: T): T {
  return (input === undefined ? input : decodeEntities(input)) as T;
}
