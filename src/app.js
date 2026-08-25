import { calculateComparison } from "./calculator.js";

const STORAGE_KEY = "compara-cenario-pt-br-v3";
const CURRENCY = "BRL";
const form = document.querySelector("#calculator-form");
const resetButton = document.querySelector("#reset-button");
const textFields = new Set([
  "financeInterestPeriod",
  "financeMaintenancePeriod",
  "financeInsurancePeriod",
  "leaseMaintenancePeriod",
  "leaseInsurancePeriod",
]);

const defaultValues = {
  vehiclePrice: 119000,
  downPayment: 80000,
  financeApr: 1.283,
  financeInterestPeriod: "month",
  months: 24,
  depreciation: 7,
  financeTax: 5160,
  financeMaintenance: 807.86,
  financeMaintenancePeriod: "year",
  financeInsurance: 4500,
  financeInsurancePeriod: "year",
  leaseMonthly: 3545,
  leaseUpfront: 0,
  leaseTax: 0,
  leaseMaintenance: 0,
  leaseMaintenancePeriod: "year",
  leaseInsurance: 0,
  leaseInsurancePeriod: "year",
  investmentReturn: 10.5,
};

const LOCALE = "pt-BR";

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

function getFormatters() {
  return {
    money: new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: CURRENCY,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    compactMoney: new Intl.NumberFormat(LOCALE, {
      style: "currency",
      currency: CURRENCY,
      notation: "compact",
      maximumFractionDigits: 1,
    }),
  };
}

function describePeriod(months) {
  if (months % 12 === 0) {
    const years = months / 12;
    return `${years} ${years === 1 ? "ano" : "anos"}`;
  }
  return `${months} meses`;
}

function chartMarkup(timeline, compactMoney) {
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

  const financePath = pathFor("financeNet");
  const leasePath = pathFor("leaseNet");
  const zeroY = y(0);
  const financeArea = `${financePath} L${x(lastMonth).toFixed(2)},${zeroY.toFixed(2)} L${x(0).toFixed(2)},${zeroY.toFixed(2)} Z`;
  const finalPoint = timeline.at(-1);
  const ticks = Array.from({ length: 4 }, (_, index) => min + (range * index) / 3).reverse();
  const xTicks = [
    { month: 0, label: "0" },
    {
      month: lastMonth / 2,
      label:
        lastMonth >= 24
          ? `${(lastMonth / 24).toFixed(lastMonth % 24 === 0 ? 0 : 1).replace(".", ",")}a`
          : `${Math.round(lastMonth / 2)}m`,
    },
    {
      month: lastMonth,
      label:
        lastMonth >= 12
          ? `${(lastMonth / 12).toFixed(lastMonth % 12 === 0 ? 0 : 1).replace(".", ",")}a`
          : `${lastMonth}m`,
    },
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
  const { money, compactMoney } = getFormatters();
  const period = describePeriod(result.inputs.months);
  const verdict = document.querySelector("#verdict");
  const verdictTitle = verdict.querySelector("h2");
  const verdictCopy = verdict.querySelector(".verdict-copy");

  setText(".result-kicker", `Após ${period}`);
  verdict.classList.toggle("lease-wins", result.winner === "lease");

  if (result.winner === "finance") {
    verdictTitle.innerHTML = `Financiar deixa você com <strong>${money.format(result.advantage)} a mais.</strong>`;
  } else if (result.winner === "lease") {
    verdictTitle.innerHTML = `O leasing deixa você com <strong>${money.format(result.advantage)} a mais.</strong>`;
  } else {
    verdictTitle.innerHTML = "Há um <strong>empate técnico.</strong>";
  }

  verdictCopy.textContent = `Investindo toda a diferença, o financiamento termina com ${money.format(result.financeNet)} e o leasing com ${money.format(result.leaseNet)}.`;

  setText("#finance-net", money.format(result.financeNet));
  setText("#lease-net", money.format(result.leaseNet));
  setText("#chart-period", `${result.inputs.months} meses`);
  setText("#finance-principal", money.format(result.principal));
  setText("#finance-payment", money.format(result.loanPayment));
  setText("#finance-monthly", money.format(result.financeMonthly));
  setText("#lease-monthly-result", money.format(result.leaseAllInMonthly));
  setText("#finance-total", money.format(result.financeTotalPaid));
  setText("#lease-total", money.format(result.leaseTotalPaid));
  setText(
    "#lease-break-even",
    money.format(result.leaseBreakEvenMonthly),
  );
  setText("#finance-portfolio", money.format(result.financePortfolio));
  setText("#lease-portfolio", money.format(result.leasePortfolio));
  setText("#vehicle-value", money.format(result.vehicleValue));
  setText(
    "#lease-initial-investment",
    money.format(result.leaseInitialInvestment),
  );
  setText(
    "#finance-initial-investment",
    money.format(result.financeInitialInvestment),
  );
  const financeMonthlyInvestment =
    result.monthlyInvestmentRecipient === "finance"
      ? result.monthlyDifference
      : 0;
  const leaseMonthlyInvestment =
    result.monthlyInvestmentRecipient === "lease"
      ? result.monthlyDifference
      : 0;
  setText(
    "#finance-monthly-investment",
    money.format(financeMonthlyInvestment),
  );
  setText("#lease-monthly-investment", money.format(leaseMonthlyInvestment));

  const chart = document.querySelector("#chart");
  chart.innerHTML = chartMarkup(result.timeline, compactMoney);
  chart.setAttribute(
    "aria-label",
    `Após ${period}, o financiamento termina com ${money.format(result.financeNet)} e o leasing com ${money.format(result.leaseNet)}.`,
  );

  const downPayment = form.elements.namedItem("downPayment");
  downPayment.max = result.inputs.vehiclePrice;
  const invalidDownPayment = Number(downPayment.value) > result.inputs.vehiclePrice;
  downPayment.setCustomValidity(
    invalidDownPayment ? "A entrada não pode ser maior que o preço do veículo." : "",
  );
  downPayment
    .closest(".input-shell")
    .classList.toggle("is-invalid", invalidDownPayment);
  document.querySelector("#down-payment-error").hidden = !invalidDownPayment;

  saveScenario(scenario);
}

form.addEventListener("input", render);
form.addEventListener("change", render);
form.addEventListener("submit", (event) => event.preventDefault());

resetButton.addEventListener("click", () => {
  setScenario(defaultValues);
  localStorage.removeItem(STORAGE_KEY);
  render();
});

loadScenario();
render();
