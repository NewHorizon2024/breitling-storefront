import { decodeEntities, decodeMaybe } from "@/lib/text";

describe("decodeEntities", () => {
  it("decodes numeric decimal entities (the AT&T catalog bug)", () => {
    expect(decodeEntities("At&#38;t smartphone")).toBe("At&t smartphone");
  });

  it("decodes named entities", () => {
    expect(decodeEntities("AT&amp;T")).toBe("AT&T");
    expect(decodeEntities("&lt;tag&gt; &quot;q&quot;")).toBe('<tag> "q"');
  });

  it("decodes hex entities", () => {
    expect(decodeEntities("it&#x27;s")).toBe("it's");
  });

  it("leaves plain text and unknown entities untouched", () => {
    expect(decodeEntities("plain text")).toBe("plain text");
    expect(decodeEntities("a & b")).toBe("a & b");
    expect(decodeEntities("&notARealEntity;")).toBe("&notARealEntity;");
  });
});

describe("decodeMaybe", () => {
  it("passes through undefined", () => {
    expect(decodeMaybe(undefined)).toBeUndefined();
  });

  it("decodes a present value", () => {
    expect(decodeMaybe("a&amp;b")).toBe("a&b");
  });
});
