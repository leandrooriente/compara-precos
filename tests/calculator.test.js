import test from "node:test";
import assert from "node:assert/strict";

import {
  annualReturnToMonthlyRate,
  calculateComparison,
  calculateLoanPayment,
  interestToMonthlyRate,
} from "../src/calculator.js";

const baseScenario = {
  vehiclePrice: 12000,
  downPayment: 0,
  financeApr: 0,
  months: 12,
  depreciation: 0,
  financeTax: 0,
  financeMaintenance: 0,
  financeInsurance: 0,
  leaseMonthly: 1000,
  leaseUpfront: 0,
  leaseTax: 0,
  leaseMaintenance: 0,
  leaseMaintenancePeriod: "year",
  leaseInsurance: 0,
  investmentReturn: 0,
};

function closeTo(actual, expected, tolerance = 0.01) {
  assert.ok(
    Math.abs(actual - expected) <= tolerance,
    `expected ${actual} to be within ${tolerance} of ${expected}`,
  );
}

test("calculates a zero-interest installment", () => {
  assert.equal(calculateLoanPayment(12000, 0, 12), 1000);
});

test("calculates a standard amortizing loan payment", () => {
  closeTo(calculateLoanPayment(30000, 6, 60), 579.98);
});

test("supports monthly and annual financing interest rates", () => {
  assert.equal(interestToMonthlyRate(1, "month"), 0.01);
  assert.equal(interestToMonthlyRate(12, "year"), 0.01);
  closeTo(
    calculateLoanPayment(30000, 1, 60, "month"),
    calculateLoanPayment(30000, 12, 60, "year"),
  );
});

test("converts effective annual investment return to a monthly rate", () => {
  const monthly = annualReturnToMonthlyRate(12);
  closeTo(Math.pow(1 + monthly, 12), 1.12, 1e-10);
});

test("makes the full financing down payment available to the lease path", () => {
  const result = calculateComparison({
    ...baseScenario,
    downPayment: 2000,
    months: 10,
    leaseMonthly: 1000,
    investmentReturn: 12,
  });

  const expected = 2000 * Math.pow(1.12, 10 / 12);
  closeTo(result.leasePortfolio, expected);
  assert.equal(result.leaseInitialInvestment, 2000);
  assert.equal(result.leaseContributions, 2000);
});

test("makes the lease amount due at signing available to the finance path", () => {
  const result = calculateComparison({
    ...baseScenario,
    downPayment: 2000,
    months: 10,
    leaseMonthly: 1000,
    leaseUpfront: 500,
    investmentReturn: 0,
  });

  assert.equal(result.leaseInitialInvestment, 2000);
  assert.equal(result.financeInitialInvestment, 500);
  assert.equal(result.leasePortfolio, 2000);
  assert.equal(result.financePortfolio, 500);
});

test("invests each monthly saving in whichever option is cheaper", () => {
  const result = calculateComparison({
    ...baseScenario,
    vehiclePrice: 1200,
    leaseMonthly: 150,
    investmentReturn: 0,
  });

  assert.equal(result.financeMonthly, 100);
  assert.equal(result.monthlyDifference, 50);
  assert.equal(result.monthlyInvestmentRecipient, "finance");
  assert.equal(result.financeContributions, 600);
  assert.equal(result.financePortfolio, 600);
  assert.equal(result.leasePortfolio, 0);
});

test("includes annual taxes, maintenance, and insurance in monthly costs", () => {
  const result = calculateComparison({
    ...baseScenario,
    financeTax: 1200,
    financeMaintenance: 600,
    financeInsurance: 1800,
    leaseTax: 600,
    leaseMaintenance: 600,
    leaseInsurance: 1200,
  });

  assert.equal(result.financeOperatingMonthly, 300);
  assert.equal(result.leaseOperatingMonthly, 200);
  assert.equal(result.financeMonthly, 1300);
  assert.equal(result.leaseAllInMonthly, 1200);
});

test("supports monthly maintenance and insurance costs", () => {
  const result = calculateComparison({
    ...baseScenario,
    financeTax: 1200,
    financeMaintenance: 600,
    financeMaintenancePeriod: "month",
    financeInsurance: 200,
    financeInsurancePeriod: "month",
    leaseTax: 1200,
    leaseMaintenance: 300,
    leaseMaintenancePeriod: "month",
    leaseInsurance: 150,
    leaseInsurancePeriod: "month",
  });

  assert.equal(result.financeOperatingMonthly, 900);
  assert.equal(result.leaseOperatingMonthly, 550);
  assert.equal(result.financeMonthly, 1900);
  assert.equal(result.leaseAllInMonthly, 1550);
});

test("compounds yearly depreciation over the comparison period", () => {
  const result = calculateComparison({
    ...baseScenario,
    months: 24,
    vehiclePrice: 20000,
    leaseMonthly: 1000,
    depreciation: 10,
  });

  closeTo(result.vehicleValue, 16200);
});

test("fully amortizes the loan by the last installment", () => {
  const result = calculateComparison({
    ...baseScenario,
    financeApr: 7.25,
    months: 72,
    vehiclePrice: 42000,
    downPayment: 5000,
  });

  closeTo(result.timeline.at(-1).loanBalance, 0);
});

test("matches the dated Volkswagen Nivus example", () => {
  const result = calculateComparison({
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
  });

  closeTo(result.loanPayment, 1898.32, 0.01);
  closeTo(result.financeMonthly, 2770.64, 0.01);
  closeTo(result.leaseAllInMonthly, 3545);
  closeTo(result.monthlyDifference, 774.36, 0.01);
  closeTo(result.vehicleValue, 102923.1);
  closeTo(result.leasePortfolio, 97682);
  closeTo(result.financePortfolio, 20484.64, 0.2);
  closeTo(result.financeNet, 123407.74, 0.2);
  closeTo(result.leaseNet, 97682);
  closeTo(result.advantage, 25725.74, 0.2);
  closeTo(result.leaseBreakEvenMonthly, 2573, 1);
  assert.equal(result.winner, "finance");
  assert.equal(result.monthlyInvestmentRecipient, "finance");
});

test("returns the option with the greater ending net value", () => {
  const result = calculateComparison(baseScenario);

  assert.equal(result.winner, "finance");
  assert.equal(result.financeNet, 12000);
  assert.equal(result.leaseNet, 0);
  assert.equal(result.advantage, 12000);
});
