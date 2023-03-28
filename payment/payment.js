class GBPrimePay {
    constructor(env = 'production') {
      if (env === 'production') {
        this.url = 'https://api.gbprimepay.com';
      } else {
        this.url = 'https://api.globalprimepay.com';
      }
    }
  
    parseData(data) {
      let fields = '';
      let index = 0;
      for (const [key, value] of Object.entries(data)) {
        index += 1;
        fields += `${key}=${encodeURIComponent(value)}`;
  
        if (index !== Object.entries(data).length) {
          fields += '&';
        }
      }
  
      if (this.isToken) {
        fields += `&token=${encodeURIComponent(this.token)}`;
      } else {
        fields += `&publicKey=${this.public_key}`;
        const concatstring = `${data.amount}${data.referenceNo}${data.responseUrl}${data.backgroundUrl}`;
        const checksum = CryptoJS.HmacSHA256(concatstring, this.secret_key).toString();
        fields += `&checksum=${checksum}`;
      }
  
      return fields;
    }
  
    async request(path, data) {
      const fields = this.parseData(data);
  
      const response = await fetch(this.url + path, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: fields
      });
      const result = await response.text();
  
      return result;
    }
}