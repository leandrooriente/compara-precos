# Compara

A car finance-vs-lease calculator that compares the full cost of each option and automatically invests the difference.

**Live site:** [leandrooriente.github.io/compara-precos](https://leandrooriente.github.io/compara-precos/)

## What it includes

- Vehicle price, down payment, loan APR, installment count, and yearly depreciation
- Annual taxes, maintenance, and insurance for financing
- Monthly payment, due-at-signing amount, taxes, and insurance for leasing
- Configurable expected annual investment return
- Automatic investment of both the upfront difference and every monthly saving
- Ending net-value comparison and a month-by-month chart
- USD, BRL, EUR, GBP, CAD, and AUD display options
- Responsive, accessible, dependency-free interface

## How the comparison works

Both choices receive the same cash budget:

1. At signing, the option with the lower upfront cost invests the difference.
2. Each month, the option with the lower all-in payment invests the difference.
3. Investment balances compound at the configured effective annual return.
4. The financed vehicle depreciates at the configured effective annual rate.
5. At the end of the loan term, financing keeps the estimated vehicle value; leasing assumes the vehicle is returned with no equity.

The result compares:

```text
finance net value = vehicle resale value + finance-path investments
lease net value   = lease-path investments
```

Loan APR is treated as a nominal annual rate divided into 12 monthly periods. Annual investment return and depreciation are converted to equivalent monthly rates.

> This calculator is for planning and education only. It does not model fees, inflation, mileage penalties, tax deductions, transaction costs, or every contract term.

## Run locally

No install or build step is needed.

```bash
npm run dev
```

Then open [http://localhost:4173](http://localhost:4173).

## Test

```bash
npm test
```

## Deployment

Pushes to `main` run the tests and deploy the static site with GitHub Actions. The workflow is in [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

## License

[MIT](LICENSE)
