# Compara

Calculadora para comparar financiamento e carro por assinatura, considerando o custo completo de cada opção e o investimento automático da diferença.

**Acesse:** [leandrooriente.github.io/compara-precos](https://leandrooriente.github.io/compara-precos/)

## Recursos

- Preço do veículo, prazo e capital inicial disponível para financiamento e assinatura
- Entrada, taxa de juros mensal ou anual e depreciação do veículo financiado
- IPVA e impostos anuais, com manutenção e seguro informados por mês ou por ano
- Mensalidade, valor inicial e impostos anuais, além de manutenção e seguro do carro por assinatura por mês ou por ano
- Rentabilidade anual esperada configurável
- Investimento do capital inicial restante em cada opção
- Investimento da diferença mensal na opção com o menor custo total
- Comparação do patrimônio final, gráfico mês a mês e mensalidade de equilíbrio
- Valores em real brasileiro, formatados no padrão `pt-BR`
- Interface responsiva, acessível e sem dependências

## Como a comparação funciona

As duas opções recebem o mesmo capital inicial:

1. O financiamento desconta a entrada e investe o capital restante.
2. O carro por assinatura desconta seu valor inicial e investe o capital restante.
3. A cada mês, a opção com o menor custo total investe a diferença em relação à opção mais cara.
4. Os investimentos rendem de acordo com a rentabilidade anual informada.
5. O veículo financiado perde valor conforme a depreciação anual configurada.
6. Ao fim do prazo, o financiamento mantém o valor estimado do veículo; na assinatura, considera-se que o carro é devolvido sem gerar patrimônio.

O resultado compara:

```text
patrimônio do financiamento = valor de revenda + investimentos
patrimônio da assinatura     = investimentos
```

A taxa de juros do financiamento pode ser informada por mês ou por ano. Quando anual, ela é tratada como uma taxa nominal dividida em 12 períodos mensais. A rentabilidade do investimento e a depreciação são convertidas em taxas mensais equivalentes.

O cenário inicial usa como exemplo um Volkswagen Tera no Rio de Janeiro, com R$ 80 mil de capital disponível, R$ 70 mil de entrada e assinatura mensal de R$ 2.678,99. Os R$ 5.008 anuais representam uma média de IPVA e licenciamento considerando a depreciação. A manutenção de R$ 724,62 corresponde à média das três primeiras revisões, e o seguro de R$ 5.500 é provisório. Confirme valores, disponibilidade e condições atuais antes de decidir.

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
