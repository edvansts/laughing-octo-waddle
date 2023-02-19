export function isValidCPF(cpf: string) {
  if (typeof cpf !== 'string') {
    return false;
  }

  cpf = cpf.replace(/[^\d]+/g, '');

  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) {
    return false;
  }

  const splittedCpf = cpf.split('').map((el) => +el);

  const rest = (count: number) =>
    ((splittedCpf
      .slice(0, count - 12)
      .reduce((soma, el, index) => soma + el * (count - index), 0) *
      10) %
      11) %
    10;

  return rest(10) === splittedCpf[9] && rest(11) === splittedCpf[10];
}
