const BASE62_CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
const BASE = 62;

function encodeToBase62(num: number): string {
  if (num < 0) {
    throw new Error("Number must be positive");
  }

  if (num === 0) {
    return BASE62_CHARACTERS.charAt(0);
  }

  let result = "";
  while (num > 0) {
    result = BASE62_CHARACTERS.charAt(num % BASE) + result;
    num = Math.floor(num / BASE);
  }

  return result;
}

export default encodeToBase62;
