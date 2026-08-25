const EPSILON = 0.005;

/** Convert a nominal annual percentage rate to a monthly rate. */
export function aprToMonthlyRate(annualRate) {
  return Number(annualRate) / 100 / 12;
}

/** Convert an annual or monthly percentage rate to a monthly rate. */
export function interestToMonthlyRate(rate, period = "year") {
  return period === "month" ? Number(rate) / 100 : aprToMonthlyRate(rate);
}

/** Convert an effective annual return to its equivalent monthly return. */
export function annualReturnToMonthlyRate(annualReturn) {
  return Math.pow(1 + Number(annualReturn) / 100, 1 / 12) - 1;
}

export function calculateLoanPayment(principal, rate, months, period = "year") {
  const amount = Math.max(0, Number(principal));
  const term = Math.max(1, Math.round(Number(months)));
  const monthlyRate = interestToMonthlyRate(rate, period);

  if (amount === 0) return 0;
  if (Math.abs(monthlyRate) < Number.EPSILON) return amount / term;

  const factor = Math.pow(1 + monthlyRate, term);
  return amount * ((monthlyRate * factor) / (factor - 1));
}

function finite(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function nonNegative(value) {
  return Math.max(0, finite(value));
}

function normalizePeriod(value) {
  return value === "month" ? "month" : "year";
}

function costPerMonth(value, period) {
  return period === "month" ? value : value / 12;
}

export function normalizeInputs(raw = {}) {
  const price = nonNegative(raw.vehiclePrice);

  return {
    vehiclePrice: price,
    downPayment: Math.min(price, nonNegative(raw.downPayment)),
    financeApr: Math.max(0, finite(raw.financeApr)),
    financeInterestPeriod: normalizePeriod(raw.financeInterestPeriod),
    months: Math.min(360, Math.max(1, Math.round(finite(raw.months, 1)))),
    depreciation: Math.min(100, Math.max(0, finite(raw.depreciation))),
    financeTax: nonNegative(raw.financeTax),
    financeMaintenance: nonNegative(raw.financeMaintenance),
    financeMaintenancePeriod: normalizePeriod(raw.financeMaintenancePeriod),
    financeInsurance: nonNegative(raw.financeInsurance),
    financeInsurancePeriod: normalizePeriod(raw.financeInsurancePeriod),
    leaseMonthly: nonNegative(raw.leaseMonthly),
    leaseUpfront: nonNegative(raw.leaseUpfront),
    leaseTax: nonNegative(raw.leaseTax),
    leaseMaintenance: nonNegative(raw.leaseMaintenance),
    leaseMaintenancePeriod: normalizePeriod(raw.leaseMaintenancePeriod),
    leaseInsurance: nonNegative(raw.leaseInsurance),
    leaseInsurancePeriod: normalizePeriod(raw.leaseInsurancePeriod),
    investmentReturn: Math.max(-99.99, finite(raw.investmentReturn)),
  };
}

/**
 * Compare financing and leasing over the financing term.
 *
 * Both choices are assigned the same initial and monthly cash budget. The
 * leasing path invests the financing down payment immediately, while the
 * financing path invests any lease amount due at signing. Each month, the
 * cheaper choice invests the cost difference. At the end, financing keeps the
 * depreciated vehicle while leasing is assumed to return it with no equity.
 */
export function calculateComparison(rawInputs) {
  const inputs = normalizeInputs(rawInputs);
  const {
    vehiclePrice,
    downPayment,
    financeApr,
    financeInterestPeriod,
    months,
    depreciation,
    financeTax,
    financeMaintenance,
    financeMaintenancePeriod,
    financeInsurance,
    financeInsurancePeriod,
    leaseMonthly,
    leaseUpfront,
    leaseTax,
    leaseMaintenance,
    leaseMaintenancePeriod,
    leaseInsurance,
    leaseInsurancePeriod,
    investmentReturn,
  } = inputs;

  const principal = vehiclePrice - downPayment;
  const loanPayment = calculateLoanPayment(
    principal,
    financeApr,
    months,
    financeInterestPeriod,
  );
  const financeOperatingMonthly =
    financeTax / 12 +
    costPerMonth(financeMaintenance, financeMaintenancePeriod) +
    costPerMonth(financeInsurance, financeInsurancePeriod);
  const leaseOperatingMonthly =
    leaseTax / 12 +
    costPerMonth(leaseMaintenance, leaseMaintenancePeriod) +
    costPerMonth(leaseInsurance, leaseInsurancePeriod);
  const financeMonthly = loanPayment + financeOperatingMonthly;
  const leaseAllInMonthly = leaseMonthly + leaseOperatingMonthly;
  const monthlyDifference = Math.abs(financeMonthly - leaseAllInMonthly);
  const monthlyInvestmentRecipient =
    monthlyDifference < EPSILON
      ? "none"
      : financeMonthly < leaseAllInMonthly
        ? "finance"
        : "lease";
  const monthlyInvestmentRate = annualReturnToMonthlyRate(investmentReturn);
  const monthlyLoanRate = interestToMonthlyRate(
    financeApr,
    financeInterestPeriod,
  );
  const monthlyValueFactor = Math.pow(1 - depreciation / 100, 1 / 12);

  const financeInitialInvestment = leaseUpfront;
  const leaseInitialInvestment = downPayment;
  let financePortfolio = financeInitialInvestment;
  let leasePortfolio = leaseInitialInvestment;
  let financeContributions = financePortfolio;
  let leaseContributions = leasePortfolio;
  let loanBalance = principal;
  let vehicleValue = vehiclePrice;

  const timeline = [
    {
      month: 0,
      vehicleValue,
      loanBalance,
      financeEquity: vehicleValue - loanBalance,
      financePortfolio,
      leasePortfolio,
      financeNet: vehicleValue - loanBalance + financePortfolio,
      leaseNet: leasePortfolio,
    },
  ];

  for (let month = 1; month <= months; month += 1) {
    financePortfolio *= 1 + monthlyInvestmentRate;
    leasePortfolio *= 1 + monthlyInvestmentRate;

    if (financeMonthly < leaseAllInMonthly) {
      const contribution = leaseAllInMonthly - financeMonthly;
      financePortfolio += contribution;
      financeContributions += contribution;
    } else if (leaseAllInMonthly < financeMonthly) {
      const contribution = financeMonthly - leaseAllInMonthly;
      leasePortfolio += contribution;
      leaseContributions += contribution;
    }

    if (loanBalance > EPSILON) {
      const interest = loanBalance * monthlyLoanRate;
      const principalPayment = Math.min(
        loanBalance,
        Math.max(0, loanPayment - interest),
      );
      loanBalance = Math.max(0, loanBalance - principalPayment);
    }

    vehicleValue *= monthlyValueFactor;
    const financeEquity = vehicleValue - loanBalance;

    timeline.push({
      month,
      vehicleValue,
      loanBalance,
      financeEquity,
      financePortfolio,
      leasePortfolio,
      financeNet: financeEquity + financePortfolio,
      leaseNet: leasePortfolio,
    });
  }

  const financeNet = vehicleValue + financePortfolio;
  const leaseNet = leasePortfolio;
  const difference = financeNet - leaseNet;
  const winner =
    Math.abs(difference) < EPSILON
      ? "tie"
      : difference > 0
        ? "finance"
        : "lease";

  return {
    inputs,
    winner,
    difference,
    advantage: Math.abs(difference),
    principal,
    loanPayment,
    loanInterest: Math.max(0, loanPayment * months - principal),
    financeOperatingMonthly,
    leaseOperatingMonthly,
    financeMonthly,
    leaseAllInMonthly,
    monthlyDifference,
    monthlyInvestmentRecipient,
    financeTotalPaid: downPayment + financeMonthly * months,
    leaseTotalPaid: leaseUpfront + leaseAllInMonthly * months,
    vehicleValue,
    financePortfolio,
    leasePortfolio,
    financeInitialInvestment,
    leaseInitialInvestment,
    financeContributions,
    leaseContributions,
    financeInvestmentGrowth: financePortfolio - financeContributions,
    leaseInvestmentGrowth: leasePortfolio - leaseContributions,
    financeNet,
    leaseNet,
    timeline,
  };
}
