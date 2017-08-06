export default class StringUtil {
  /**
   * remove Angle Brackets
   * @param { string } sheet the sheet in use
   * @return { string } str
   */
  static removeAngleBrackets(str) {
    str = str.replace(/</g, '');
    str = str.replace(/>/g, '');
    return str;
  }

  // 文字列をUTF8の16進文字列に変換
  static stringToUtf8HexString(text) {
    const bytes1 = this.stringToUtf8Bytes(text);
    const hexStr1 = this.bytesToHexString(bytes1);
    return hexStr1;
  }

  // UTF8の16進文字列を文字列に変換
  static utf8HexStringToString(hexStr1) {
    const bytes2 = this.hexStringToBytes(hexStr1);
    const str2 = this.utf8BytesToString(bytes2);
    return str2;
  }

  // 文字列をUTF8のバイト配列に変換
  static stringToUtf8Bytes(text) {
    const result = [];
    if (text == null) {
      return result;
    }
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      if (c <= 0x7f) {
        result.push(c);
      } else if (c <= 0x07ff) {
        result.push(((c >> 6) & 0x1F) | 0xC0);
        result.push((c & 0x3F) | 0x80);
      } else {
        result.push(((c >> 12) & 0x0F) | 0xE0);
        result.push(((c >> 6) & 0x3F) | 0x80);
        result.push((c & 0x3F) | 0x80);
      }
    }
    return result;
  }

// バイト値を16進文字列に変換
  static byteToHex(byteNum)
  {
    const digits = (byteNum).toString(16);
    if (byteNum < 16) return '0' + digits;
    return digits;
  }

// バイト配列を16進文字列に変換
  static bytesToHexString(bytes) {
    let	result = '';

    for (let i = 0; i < bytes.length; i++) {
      result += byte_to_hex(bytes[i]);
    }
    return result;
  }

// 16進文字列をバイト値に変換
  static hexToByte(hexStr) {
    return parseInt(hexStr, 16);
  }

  // バイト配列を16進文字列に変換
  static hexStringToBytes(hexStr) {
    let	result = [];

    for (let i = 0; i < hexStr.length; i += 2) {
      result.push(this.hexToByte(hexStr.substr(i, 2)));
    }
    return result;
  }

// UTF8のバイト配列を文字列に変換
  static utf8BytesToString(arr) {
    if (arr == null) {
      return null;
    }
    let result = '';
    let i;
    while (i = arr.shift()) {
      if (i <= 0x7f) {
        result += String.fromCharCode(i);
      } else if (i <= 0xdf) {
        var c = ((i&0x1f)<<6);
        c += arr.shift()&0x3f;
        result += String.fromCharCode(c);
      } else if (i <= 0xe0) {
        var c = ((arr.shift()&0x1f)<<6)|0x0800;
        c += arr.shift()&0x3f;
        result += String.fromCharCode(c);
      } else {
        var c = ((i&0x0f)<<12);
        c += (arr.shift()&0x3f)<<6;
        c += arr.shift() & 0x3f;
        result += String.fromCharCode(c);
      }
    }
    return result;
  }

  /**
   * Remove P Tag
   * @param { String } str
   * @return { String } str
   */
  static removePTag(str) {
    str = str.replace(/<(\/?|\!?)(p)>/g, '');
    return str;
  }
}
