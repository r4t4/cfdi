'use strict';

const CFDI = require('./index').CFDI;
const debug = require('debug')('cdfi:parse');

// const one = new CFDI('./cfd/min-payment.xml');
// const two = new CFDI('./cfd/payment.xml');
// const three = new CFDI('./cfd/signed.xml');
//const e32 = new CFDI('./cfd/wrong.32.xml');
//const e33 = new CFDI('./cfd/wrong.33.xml');

//console.log(e32.version());
//console.log(e33.version());

const main = async () => {
  const e32 = await new CFDI('./cfd/wrong.32.xml');
  const e33 = await new CFDI('./cfd/wrong.33.xml');
  const good = await new CFDI('./cfd/signed.xml');

  // debug('= = = = = = WRONG 3.2 = = = = = = = =');
  // debug(e32.comprobante());
  debug(e32.relacionados());
  // debug(e32.crypto());
  // debug(e32.uuid());
  // debug(e32.emisor());
  // debug(e32.receptor());
  // debug('= = = = = = WRONG 3.2 = = = = = = = =')

  // debug('= = = = = = WRONG 3.3 = = = = = = = =')
  // debug(e33.comprobante());
  debug(e33.relacionados());
  // debug(e33.crypto());
  // debug(e33.uuid());
  // debug(e33.emisor());
  // debug(e33.receptor());
  // debug('= = = = = = WRONG 3.3 = = = = = = = =')

  debug('= = = = = = RIGHT = = = = = = = =');
  // debug(good.comprobante());
  debug(good.relacionados());
  // debug(good.crypto());
  // debug(good.uuid());
  // debug(good.emisor());
  // debug(good.receptor());
  debug('= = = = = = RIGHT = = = = = = = =');
};
main();
