export const DEFAULT_LANGUAGE = "pt-BR";
export const DEFAULT_CURRENCY = "BRL";
export const SUPPORTED_LANGUAGES = ["pt-BR", "en"];
export const SUPPORTED_CURRENCIES = ["BRL", "EUR", "USD"];

const messages = {
  "pt-BR": {
    pageTitle: "Compara — Comprar ou ter um carro por assinatura?",
    pageDescription:
      "Compare financiamento e carro por assinatura, incluindo custos, depreciação e o investimento da diferença.",
    language: "Idioma",
    currency: "Moeda",
    kicker: "Calculadora de decisão automotiva",
    heroTitle: "Comprar ou ter um carro por assinatura?",
    heroCopy:
      "Compare custos, patrimônio e investimentos no mesmo prazo. Informe os valores; o resultado é atualizado imediatamente.",
    assumptions: "Premissas",
    enterValues: "Informe os valores",
    reset: "Redefinir",
    vehicleAndTerm: "Veículo e prazo",
    sharedAssumptions: "Premissas usadas nas duas opções.",
    vehiclePrice: "Preço do veículo",
    comparisonTerm: "Prazo da comparação",
    initialCapital: "Capital inicial disponível",
    months: "meses",
    initialCapitalError: "O capital deve cobrir o maior desembolso inicial.",
    exampleReference:
      "<strong>Exemplo:</strong> Volkswagen Tera · Rio de Janeiro. Cada opção investe o capital que sobra após seu desembolso inicial.",
    financedPurchase: "Compra financiada",
    financing: "Financiamento",
    financingEquity: "Você termina o prazo com o veículo.",
    downPayment: "Entrada",
    downPaymentError: "A entrada não pode superar o preço do veículo.",
    interestRate: "Taxa de juros",
    interestRatePeriod: "Periodicidade da taxa de juros",
    annualDepreciation: "Depreciação anual",
    additionalCosts: "Custos adicionais",
    taxesAndDocumentation: "Impostos e documentação",
    maintenance: "Manutenção",
    insurance: "Seguro",
    maintenancePeriod: "Periodicidade da manutenção",
    financeInsurancePeriod: "Periodicidade do seguro do financiamento",
    year: "ano",
    month: "mês",
    subscription: "Assinatura",
    carSubscription: "Carro por assinatura",
    subscriptionReturn: "Você devolve o veículo ao fim do prazo.",
    subscriptionMonthly: "Mensalidade da assinatura",
    upfrontAmount: "Valor inicial <small>opcional</small>",
    leaseReference:
      "Mensalidade de referência da Unidas. Confirme disponibilidade, quilometragem e condições atuais antes de decidir.",
    additionalCostsZero: "Custos adicionais — use zero quando inclusos",
    taxes: "Impostos",
    leaseMaintenancePeriod: "Periodicidade da manutenção do carro por assinatura",
    leaseInsurancePeriod: "Periodicidade do seguro do carro por assinatura",
    investmentDifference: "Investimento da diferença",
    investmentSubtitle: "Cada opção investe o capital que não utiliza.",
    expectedReturn: "Retorno líquido anual esperado",
    investmentExplanation:
      "O capital inicial restante é investido em cada opção. Todo mês, a alternativa mais barata também investe a diferença de custo.",
    automaticContributions: "Aportes automáticos",
    origin: "Origem",
    initialContribution: "Inicial <small>capital menos desembolso</small>",
    monthlyContribution: "Mensal <small>diferença de custo</small>",
    comparisonResult: "Resultado da comparação",
    resultPeriodInitial: "Após 5 anos",
    calculating: "Calculando a melhor escolha…",
    adjustValues: "Ajuste os valores para comparar as duas opções.",
    finalEquity: "patrimônio final",
    evolution: "Evolução",
    equityOverTime: "Patrimônio ao longo do tempo",
    chartAria: "Patrimônio do financiamento e do carro por assinatura ao longo do tempo",
    vehicleAndInvestments: "Veículo + investimentos",
    subscriptionInvestments: "Investimentos da assinatura",
    comparison: "Comparação",
    costsAndFinalValues: "Custos e valores finais",
    metric: "Métrica",
    financeShort: "Financ.",
    financedAmount: "Valor financiado",
    financePayment: "Parcela do financiamento",
    monthlyCost: "Custo mensal",
    totalOutlay: "Desembolso total",
    investedBalance: "Saldo investido",
    vehicleValue: "Valor do veículo",
    breakEvenSubscription: "Assinatura de equilíbrio",
    methodNote:
      "No fim da assinatura, o veículo é devolvido sem gerar patrimônio. Os investimentos usam a mesma rentabilidade nas duas opções.",
    periodAfter: "Após {period}",
    financeWins: "Financiar deixa você com <strong>{advantage} a mais.</strong>",
    leaseWins: "O carro por assinatura deixa você com <strong>{advantage} a mais.</strong>",
    tie: "Há um <strong>empate técnico.</strong>",
    verdictCopy:
      "Investindo toda a diferença, o financiamento termina com {finance} e o carro por assinatura com {lease}.",
    chartSummary:
      "Após {period}, o financiamento termina com {finance} e o carro por assinatura com {lease}.",
    downPaymentValidity: "A entrada não pode ser maior que o preço do veículo.",
    initialCapitalValidity: "O capital inicial deve cobrir o maior desembolso inicial.",
    oneYear: "1 ano",
    manyYears: "{count} anos",
    manyMonths: "{count} meses",
    chartYearSuffix: "a",
    chartMonthSuffix: "m",
  },
  en: {
    pageTitle: "Compara — Buy or subscribe to a car?",
    pageDescription:
      "Compare car financing and subscriptions, including costs, depreciation, and investing the difference.",
    language: "Language",
    currency: "Currency",
    kicker: "Automotive decision calculator",
    heroTitle: "Buy or subscribe to a car?",
    heroCopy:
      "Compare costs, equity, and investments over the same term. Enter your figures and the result updates immediately.",
    assumptions: "Assumptions",
    enterValues: "Enter your figures",
    reset: "Reset",
    vehicleAndTerm: "Vehicle and term",
    sharedAssumptions: "Assumptions shared by both options.",
    vehiclePrice: "Vehicle price",
    comparisonTerm: "Comparison term",
    initialCapital: "Available initial capital",
    months: "months",
    initialCapitalError: "Capital must cover the larger upfront payment.",
    exampleReference:
      "<strong>Example:</strong> Volkswagen Tera · Rio de Janeiro. Each option invests the capital left after its upfront payment.",
    financedPurchase: "Financed purchase",
    financing: "Financing",
    financingEquity: "You own the vehicle at the end of the term.",
    downPayment: "Down payment",
    downPaymentError: "The down payment cannot exceed the vehicle price.",
    interestRate: "Interest rate",
    interestRatePeriod: "Interest-rate period",
    annualDepreciation: "Annual depreciation",
    additionalCosts: "Additional costs",
    taxesAndDocumentation: "Taxes and registration",
    maintenance: "Maintenance",
    insurance: "Insurance",
    maintenancePeriod: "Maintenance period",
    financeInsurancePeriod: "Financing insurance period",
    year: "year",
    month: "month",
    subscription: "Subscription",
    carSubscription: "Car subscription",
    subscriptionReturn: "You return the vehicle at the end of the term.",
    subscriptionMonthly: "Monthly subscription",
    upfrontAmount: "Upfront amount <small>optional</small>",
    leaseReference:
      "The default monthly price is a Unidas reference. Confirm availability, mileage, and current terms before deciding.",
    additionalCostsZero: "Additional costs — use zero when included",
    taxes: "Taxes",
    leaseMaintenancePeriod: "Car-subscription maintenance period",
    leaseInsurancePeriod: "Car-subscription insurance period",
    investmentDifference: "Investing the difference",
    investmentSubtitle: "Each option invests the capital it does not use.",
    expectedReturn: "Expected net annual return",
    investmentExplanation:
      "Each option invests its remaining initial capital. Every month, the cheaper alternative also invests the difference in cost.",
    automaticContributions: "Automatic contributions",
    origin: "Source",
    initialContribution: "Initial <small>capital minus upfront payment</small>",
    monthlyContribution: "Monthly <small>difference in cost</small>",
    comparisonResult: "Comparison result",
    resultPeriodInitial: "After 5 years",
    calculating: "Calculating the better choice…",
    adjustValues: "Adjust the figures to compare both options.",
    finalEquity: "final net worth",
    evolution: "Evolution",
    equityOverTime: "Net worth over time",
    chartAria: "Financing and car-subscription net worth over time",
    vehicleAndInvestments: "Vehicle + investments",
    subscriptionInvestments: "Subscription investments",
    comparison: "Comparison",
    costsAndFinalValues: "Costs and final values",
    metric: "Metric",
    financeShort: "Finance",
    financedAmount: "Amount financed",
    financePayment: "Financing payment",
    monthlyCost: "Monthly cost",
    totalOutlay: "Total outlay",
    investedBalance: "Invested balance",
    vehicleValue: "Vehicle value",
    breakEvenSubscription: "Break-even subscription",
    methodNote:
      "At the end of the subscription, the vehicle is returned without generating equity. Both options use the same investment return.",
    periodAfter: "After {period}",
    financeWins: "Financing leaves you with <strong>{advantage} more.</strong>",
    leaseWins: "The car subscription leaves you with <strong>{advantage} more.</strong>",
    tie: "The result is a <strong>technical tie.</strong>",
    verdictCopy:
      "After investing the entire difference, financing ends with {finance} and the car subscription with {lease}.",
    chartSummary:
      "After {period}, financing ends with {finance} and the car subscription with {lease}.",
    downPaymentValidity: "The down payment cannot exceed the vehicle price.",
    initialCapitalValidity: "Initial capital must cover the larger upfront payment.",
    oneYear: "1 year",
    manyYears: "{count} years",
    manyMonths: "{count} months",
    chartYearSuffix: "y",
    chartMonthSuffix: "mo",
  },
};

export function normalizeLanguage(value) {
  return SUPPORTED_LANGUAGES.includes(value) ? value : DEFAULT_LANGUAGE;
}

export function normalizeCurrency(value) {
  return SUPPORTED_CURRENCIES.includes(value) ? value : DEFAULT_CURRENCY;
}

export function hasTranslation(language, key) {
  return Object.hasOwn(messages[normalizeLanguage(language)], key);
}

export function translate(language, key, variables = {}) {
  const normalizedLanguage = normalizeLanguage(language);
  const template = messages[normalizedLanguage][key] ?? messages[DEFAULT_LANGUAGE][key] ?? key;
  return Object.entries(variables).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

export function createCurrencyFormatters(language, currency) {
  const locale = normalizeLanguage(language);
  const normalizedCurrency = normalizeCurrency(currency);
  return {
    money: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),
    compactMoney: new Intl.NumberFormat(locale, {
      style: "currency",
      currency: normalizedCurrency,
      notation: "compact",
      maximumFractionDigits: 1,
    }),
    decimal: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }),
  };
}

export function describePeriod(months, language) {
  const normalizedMonths = Math.max(1, Math.round(Number(months)));
  if (normalizedMonths % 12 === 0) {
    const years = normalizedMonths / 12;
    return years === 1
      ? translate(language, "oneYear")
      : translate(language, "manyYears", { count: years });
  }
  return translate(language, "manyMonths", { count: normalizedMonths });
}
