export function generateRandomDigitalNumbers(length: number): String {
  var res = '';
  for (let i = 0; i < length; i++) {
    res += Math.ceil(Math.random() * 9);
  }
  return res;
}
