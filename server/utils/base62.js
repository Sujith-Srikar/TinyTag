const CHARACTERS =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function encodeToBase62(num) {
  let result = "";
  while (num > 0) {
    result = CHARACTERS[num % 62] + result;
    num = Math.floor(num / 62);
  }
  return result;
}

module.exports = { encodeToBase62 };