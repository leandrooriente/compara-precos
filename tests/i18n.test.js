import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

import {
  createCurrencyFormatters,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  describePeriod,
  hasTranslation,
  normalizeCurrency,
  normalizeLanguage,
  translate,
} from "../src/i18n.js";

test("supports BRL, EUR, and USD currency formatting", () => {
  const brl = createCurrencyFormatters("pt-BR", "BRL").money.format(1234.5);
  const eur = createCurrencyFormatters("en", "EUR").money.format(1234.5);
  const usd = createCurrencyFormatters("en", "USD").money.format(1234.5);

  assert.match(brl, /R\$/);
  assert.match(brl, /1\.234,50/);
  assert.equal(eur, "€1,234.50");
  assert.equal(usd, "$1,234.50");
});

test("normalizes unsupported preferences", () => {
  assert.equal(normalizeLanguage("en"), "en");
  assert.equal(normalizeLanguage("fr"), DEFAULT_LANGUAGE);
  assert.equal(normalizeCurrency("EUR"), "EUR");
  assert.equal(normalizeCurrency("GBP"), DEFAULT_CURRENCY);
});

test("every HTML translation binding exists in both languages", () => {
  const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
  const keys = [
    ...html.matchAll(/data-i18n(?:-html|-aria-label|-content)?="([^"]+)"/g),
  ].map((match) => match[1]);

  assert.ok(keys.length > 0);
  for (const key of new Set(keys)) {
    assert.equal(hasTranslation("pt-BR", key), true, `missing pt-BR: ${key}`);
    assert.equal(hasTranslation("en", key), true, `missing en: ${key}`);
  }
});

test("translates periods and dynamic copy", () => {
  assert.equal(describePeriod(12, "pt-BR"), "1 ano");
  assert.equal(describePeriod(24, "en"), "2 years");
  assert.equal(describePeriod(18, "pt-BR"), "18 meses");
  assert.equal(describePeriod(18, "en"), "18 months");
  assert.equal(
    translate("en", "periodAfter", { period: "3 years" }),
    "After 3 years",
  );
});
