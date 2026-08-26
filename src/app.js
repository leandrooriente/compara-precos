import { calculateComparison } from "./calculator.js";
import {
  createCurrencyFormatters,
  DEFAULT_CURRENCY,
  DEFAULT_LANGUAGE,
  describePeriod,
  normalizeCurrency,
  normalizeLanguage,
  translate,
} from "./i18n.js";

const STORAGE_KEY = "compara-cenario-pt-br-v4";
const PREFERENCES_KEY = "compara-preferences-v1";
const form = document.querySelector("#calculator-form");
const resetButton = document.querySelector("#reset-button");
const languageSelect = document.querySelector("#language-select");
const currencySelect = document.querySelector("#currency-select");
const textFields = new Set([
  "financeInterestPeriod",
  "financeMaintenancePeriod",
  "financeInsurancePeriod",
  "leaseMaintenancePeriod",
  "leaseInsurancePeriod",
]);

const defaultValues = {
  vehiclePrice: 133190,
  initialCapital: 80000,
  downPayment: 70000,
  financeApr: 2.281829,
  financeInterestPeriod: "month",
  months: 36,
  depreciation: 12,
  financeTax: 5008,
  financeMaintenance: 724.62,
  financeMaintenancePeriod: "year",
  financeInsurance: 5500,
  financeInsurancePeriod: "year",
  leaseMonthly: 2678.99,
  leaseUpfront: 0,
  leaseTax: 0,
  leaseMaintenance: 0,
  leaseMaintenancePeriod: "year",
  leaseInsurance: 0,
  leaseInsurancePeriod: "year",
  investmentReturn: 10.5,
};

let preferences = loadPreferences();

function loadPreferences() {
  try {
    const stored = JSON.parse(localStorage.getItem(PREFERENCES_KEY));
    return {
      language: normalizeLanguage(stored?.language),
      currency: normalizeCurrency(stored?.currency),
    };
  } catch {
    localStorage.removeItem(PREFERENCES_KEY);
    return { language: DEFAULT_LANGUAGE, currency: DEFAULT_CURRENCY };
  }
}

function savePreferences() {
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
  } catch {
    // Language and currency still work when storage is unavailable.
  }
}

function getScenario() {
  return Object.fromEntries(
    [...form.elements]
      .filter((element) => element.name)
      .map((element) => [
        element.name,
        textFields.has(element.name) ? element.value : Number(element.value),
      ]),
  );
}

function setScenario(scenario) {
  Object.entries({ ...defaultValues, ...scenario }).forEach(([name, value]) => {
    const control = form.elements.namedItem(name);
    if (control) control.value = value;
  });
}

function loadScenario() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (stored && typeof stored === "object") setScenario(stored);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function saveScenario(scenario) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
  } catch {
    // The calculator still works when storage is unavailable.
  }
}

function currencySymbol() {
  const formatter = new Intl.NumberFormat(preferences.language, {
    style: "currency",
    currency: preferences.currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return (
    formatter
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value ?? preferences.currency
  );
}

function applyTranslations() {
  const { language } = preferences;
  document.documentElement.lang = language;
  document.title = translate(language, "pageTitle");
  document
    .querySelectorAll("[data-i18n]")
    .forEach((element) => {
      element.textContent = translate(language, element.dataset.i18n);
    });
  document
    .querySelectorAll("[data-i18n-html]")
    .forEach((element) => {
      element.innerHTML = translate(language, element.dataset.i18nHtml);
    });
  document
    .querySelectorAll("[data-i18n-aria-label]")
    .forEach((element) => {
      element.setAttribute(
        "aria-label",
        translate(language, element.dataset.i18nAriaLabel),
      );
    });
  document
    .querySelectorAll("[data-i18n-content]")
    .forEach((element) => {
      element.setAttribute(
        "content",
        translate(language, element.dataset.i18nContent),
      );
    });
  languageSelect.setAttribute("aria-label", translate(language, "language"));
  currencySelect.setAttribute("aria-label", translate(language, "currency"));
  document
    .querySelectorAll(".currency-prefix")
    .forEach((element) => {
      element.textContent = currencySymbol();
    });
}

function chartMarkup(timeline, formatters) {
  const { compactMoney, decimal } = formatters;
  const { language } = preferences;
  const width = 430;
  const height = 178;
  const margin = { top: 8, right: 9, bottom: 24, left: 62 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;
  const values = timeline.flatMap((point) => [point.financeNet, point.leaseNet]);
  const rawMin = Math.min(0, ...values);
  const rawMax = Math.max(1, ...values);
  const padding = Math.max((rawMax - rawMin) * 0.08, 1);
  const min = rawMin < 0 ? rawMin - padding : 0;
  const max = rawMax + padding;
  const range = max - min;
  const lastMonth = timeline.at(-1).month;
  const x = (month) => margin.left + (month / Math.max(1, lastMonth)) * plotWidth;
  const y = (value) => margin.top + ((max - value) / range) * plotHeight;
  const pathFor = (key) =>
    timeline
      .map((point, index) => `${index === 0 ? "M" : "L"}${x(point.month).toFixed(2)},${y(point[key]).toFixed(2)}`)
      .join(" ");
  const chartTick = (months) =>
    months >= 12
      ? `${decimal.format(months / 12)}${translate(language, "chartYearSuffix")}`
      : `${Math.round(months)}${translate(language, "chartMonthSuffix")}`;

  const financePath = pathFor("financeNet");
  const leasePath = pathFor("leaseNet");
  const zeroY = y(0);
  const financeArea = `${financePath} L${x(lastMonth).toFixed(2)},${zeroY.toFixed(2)} L${x(0).toFixed(2)},${zeroY.toFixed(2)} Z`;
  const finalPoint = timeline.at(-1);
  const ticks = Array.from({ length: 4 }, (_, index) => min + (range * index) / 3).reverse();
  const xTicks = [
    { month: 0, label: "0" },
    { month: lastMonth / 2, label: chartTick(lastMonth / 2) },
    { month: lastMonth, label: chartTick(lastMonth) },
  ];

  return `
    <svg viewBox="0 0 ${width} ${height}" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="finance-gradient" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stop-color="#006974" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#006974" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${ticks
        .map(
          (tick) => `
            <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick).toFixed(2)}" y2="${y(tick).toFixed(2)}" />
            <text class="chart-label" x="${margin.left - 7}" y="${(y(tick) + 3).toFixed(2)}" text-anchor="end">${compactMoney.format(tick)}</text>
          `,
        )
        .join("")}
      ${min < 0 ? `<line class="chart-zero" x1="${margin.left}" x2="${width - margin.right}" y1="${zeroY}" y2="${zeroY}" />` : ""}
      <path class="finance-area" d="${financeArea}" />
      <path class="finance-line" d="${financePath}" />
      <path class="lease-line" d="${leasePath}" />
      <circle class="endpoint-finance" cx="${x(lastMonth)}" cy="${y(finalPoint.financeNet)}" r="4" />
      <circle class="endpoint-lease" cx="${x(lastMonth)}" cy="${y(finalPoint.leaseNet)}" r="4" />
      ${xTicks
        .map(
          ({ month, label }) => `<text class="chart-label" x="${x(month)}" y="${height - 5}" text-anchor="middle">${label}</text>`,
        )
        .join("")}
    </svg>
  `;
}

function setText(selector, value) {
  document.querySelector(selector).textContent = value;
}

function render() {
  const scenario = getScenario();
  const result = calculateComparison(scenario);
  const formatters = createCurrencyFormatters(
    preferences.language,
    preferences.currency,
  );
  const { money, compactMoney } = formatters;
  const period = describePeriod(result.inputs.months, preferences.language);
  const verdict = document.querySelector("#verdict");
  const verdictTitle = verdict.querySelector("h2");
  const verdictCopy = verdict.querySelector(".verdict-copy");

  setText(
    ".result-kicker",
    translate(preferences.language, "periodAfter", { period }),
  );
  verdict.classList.toggle("lease-wins", result.winner === "lease");

  if (result.winner === "finance") {
    verdictTitle.innerHTML = translate(preferences.language, "financeWins", {
      advantage: money.format(result.advantage),
    });
  } else if (result.winner === "lease") {
    verdictTitle.innerHTML = translate(preferences.language, "leaseWins", {
      advantage: money.format(result.advantage),
    });
  } else {
    verdictTitle.innerHTML = translate(preferences.language, "tie");
  }

  verdictCopy.textContent = translate(preferences.language, "verdictCopy", {
    finance: money.format(result.financeNet),
    lease: money.format(result.leaseNet),
  });

  setText("#finance-net", money.format(result.financeNet));
  setText("#lease-net", money.format(result.leaseNet));
  setText("#chart-period", period);
  setText("#finance-principal", money.format(result.principal));
  setText("#finance-payment", money.format(result.loanPayment));
  setText("#finance-monthly", money.format(result.financeMonthly));
  setText("#lease-monthly-result", money.format(result.leaseAllInMonthly));
  setText("#finance-total", money.format(result.financeTotalPaid));
  setText("#lease-total", money.format(result.leaseTotalPaid));
  setText("#lease-break-even", money.format(result.leaseBreakEvenMonthly));
  setText("#finance-portfolio", money.format(result.financePortfolio));
  setText("#lease-portfolio", money.format(result.leasePortfolio));
  setText("#vehicle-value", money.format(result.vehicleValue));
  setText("#lease-initial-investment", money.format(result.leaseInitialInvestment));
  setText("#finance-initial-investment", money.format(result.financeInitialInvestment));
  const financeMonthlyInvestment =
    result.monthlyInvestmentRecipient === "finance" ? result.monthlyDifference : 0;
  const leaseMonthlyInvestment =
    result.monthlyInvestmentRecipient === "lease" ? result.monthlyDifference : 0;
  setText("#finance-monthly-investment", money.format(financeMonthlyInvestment));
  setText("#lease-monthly-investment", money.format(leaseMonthlyInvestment));

  const chart = document.querySelector("#chart");
  chart.innerHTML = chartMarkup(result.timeline, { ...formatters, compactMoney });
  chart.setAttribute(
    "aria-label",
    translate(preferences.language, "chartSummary", {
      period,
      finance: money.format(result.financeNet),
      lease: money.format(result.leaseNet),
    }),
  );

  const downPayment = form.elements.namedItem("downPayment");
  downPayment.max = result.inputs.vehiclePrice;
  const invalidDownPayment = Number(downPayment.value) > result.inputs.vehiclePrice;
  downPayment.setCustomValidity(
    invalidDownPayment
      ? translate(preferences.language, "downPaymentValidity")
      : "",
  );
  downPayment
    .closest(".input-shell")
    .classList.toggle("is-invalid", invalidDownPayment);
  document.querySelector("#down-payment-error").hidden = !invalidDownPayment;

  const initialCapital = form.elements.namedItem("initialCapital");
  const requiredInitialCapital = Math.max(
    Number(downPayment.value),
    Number(form.elements.namedItem("leaseUpfront").value),
  );
  const invalidInitialCapital = Number(initialCapital.value) < requiredInitialCapital;
  initialCapital.setCustomValidity(
    invalidInitialCapital
      ? translate(preferences.language, "initialCapitalValidity")
      : "",
  );
  initialCapital
    .closest(".input-shell")
    .classList.toggle("is-invalid", invalidInitialCapital);
  document.querySelector("#initial-capital-error").hidden = !invalidInitialCapital;

  saveScenario(scenario);
}

form.addEventListener("input", render);
form.addEventListener("change", render);
form.addEventListener("submit", (event) => event.preventDefault());

languageSelect.addEventListener("change", () => {
  preferences.language = normalizeLanguage(languageSelect.value);
  savePreferences();
  applyTranslations();
  render();
});

currencySelect.addEventListener("change", () => {
  preferences.currency = normalizeCurrency(currencySelect.value);
  savePreferences();
  applyTranslations();
  render();
});

resetButton.addEventListener("click", () => {
  setScenario(defaultValues);
  localStorage.removeItem(STORAGE_KEY);
  render();
});

languageSelect.value = preferences.language;
currencySelect.value = preferences.currency;
applyTranslations();
loadScenario();
render();
