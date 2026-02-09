import { describe, it, expect } from "vitest";
import { parseDynamicJSON } from "../lib/utils";

describe("parseDynamicJSON", () => {
    it("should parse pure JSON", () => {
        const input = '{"success": true}';
        expect(parseDynamicJSON(input)).toEqual({ success: true });
    });

    it("should parse JSON wrapped in markdown blocks", () => {
        const input = '```json\n{"foo": "bar"}\n```';
        expect(parseDynamicJSON(input)).toEqual({ foo: "bar" });
    });

    it("should parse JSON wrapped in markdown without language tag", () => {
        const input = '```\n{"hello": "world"}\n```';
        expect(parseDynamicJSON(input)).toEqual({ hello: "world" });
    });

    it("should handle double-stringified JSON", () => {
        const input = '"{\\"val\\": 123}"';
        expect(parseDynamicJSON(input)).toEqual({ val: 123 });
    });

    it("should handle whitespace and newlines", () => {
        const input = '  \n  {"data": [1, 2, 3]}  \n  ';
        expect(parseDynamicJSON(input)).toEqual({ data: [1, 2, 3] });
    });

    it("should return null for invalid JSON", () => {
        const input = "not json";
        expect(parseDynamicJSON(input)).toBeNull();
    });

    it("should return original object if input is already an object", () => {
        const input = { exists: true };
        expect(parseDynamicJSON(input)).toEqual({ exists: true });
    });

    it("should handle double-stringified JSON with markdown", () => {
        const inner = JSON.stringify({ a: 1 });
        const input = '```json\n' + JSON.stringify(inner) + '\n```';
        expect(parseDynamicJSON(input)).toEqual({ a: 1 });
    });

    it("should extract JSON even with leading/trailing text", () => {
        const input = 'Here is the result: {"status": "ok"} Enjoy!';
        expect(parseDynamicJSON(input)).toEqual({ status: "ok" });
    });
});
