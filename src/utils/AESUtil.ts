import Crypto from "./pbkdf2";
import { AES } from "crypto-js";
import { lib } from "crypto-js";
import { enc } from "crypto-js";

export default class AesUtil {
  keySize: number;
  iterationCount: number;
  constructor(keySize: number, iterationCount: number) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
  }

  generateKey = (salt: string, passPhrase: string | lib.WordArray) => {
    const key = Crypto.PBKDF2(passPhrase, enc.Hex.parse(salt), {
      keySize: this.keySize,
      iterations: this.iterationCount,
    });
    return key;
  };

  encrypt = (
    salt: string,
    iv: string,
    passPhrase: string | lib.WordArray,
    plainText: string | lib.WordArray
  ) => {
    const key = this.generateKey(salt, passPhrase);
    const encrypted = AES.encrypt(plainText, key, {
      iv: enc.Hex.parse(iv),
    });

    return encrypted.ciphertext.toString(enc.Base64);
  };

  decrypt = (
    salt: string,
    iv: string,
    passPhrase: string | lib.WordArray,
    cipherText: string
  ) => {
    const key = this.generateKey(salt, passPhrase);
    const cipherParams = lib.CipherParams.create({
      ciphertext: enc.Base64.parse(cipherText),
    });
    const decrypted = AES.decrypt(cipherParams, key, {
      iv: enc.Hex.parse(iv),
    });
    return decrypted.toString(enc.Utf8);
  };
}
