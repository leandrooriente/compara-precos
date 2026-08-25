# Compara

Calculadora para comparar financiamento e leasing de veículos, considerando o custo completo de cada opção e o investimento automático da diferença.

**Acesse:** [leandrooriente.github.io/compara-precos](https://leandrooriente.github.io/compara-precos/)

## Recursos

- Preço do veículo e prazo compartilhado pelo financiamento e pelo leasing
- Entrada, taxa de juros mensal ou anual e depreciação do veículo financiado
- IPVA e impostos anuais, com manutenção e seguro informados por mês ou por ano
- Parcela mensal, valor inicial e impostos anuais, além de manutenção e seguro do leasing por mês ou por ano
- Rentabilidade anual esperada configurável
- Entrada disponível imediatamente para investir no leasing
- Investimento da diferença mensal na opção com o menor custo total
- Comparação do patrimônio final e gráfico mês a mês
- Valores em real brasileiro, formatados no padrão `pt-BR`
- Interface responsiva, acessível e sem dependências

## Como a comparação funciona

As duas opções recebem o mesmo orçamento:

1. No leasing, o valor total da entrada do financiamento fica disponível para investir imediatamente.
2. No financiamento, qualquer valor inicial do leasing também fica disponível para investir.
3. A cada mês, a opção com o menor custo total investe a diferença em relação à opção mais cara.
4. Os investimentos rendem de acordo com a rentabilidade anual informada.
5. O veículo financiado perde valor conforme a depreciação anual configurada.
6. Ao fim do prazo, o financiamento mantém o valor estimado do veículo; no leasing, considera-se que o carro é devolvido sem gerar patrimônio.

O resultado compara:

```text
patrimônio do financiamento = valor de revenda + investimentos
patrimônio do leasing        = investimentos
```

A taxa de juros do financiamento pode ser informada por mês ou por ano. Quando anual, ela é tratada como uma taxa nominal dividida em 12 períodos mensais. A rentabilidade do investimento e a depreciação são convertidas em taxas mensais equivalentes.

> Esta calculadora serve apenas para planejamento e educação financeira. Ela não considera tarifas, inflação, limite de quilometragem, multas contratuais, benefícios fiscais, custos de transação ou todas as condições de cada contrato.

## Executar localmente

Não é necessário instalar dependências nem compilar o projeto.

```bash
npm run dev
```

Depois, acesse [http://localhost:4173](http://localhost:4173).

## Testes

```bash
npm test
```

## Publicação

Todo push para a branch `main` executa os testes e publica o site no GitHub Pages. O fluxo está em [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml).

## Licença

[MIT](LICENSE)
