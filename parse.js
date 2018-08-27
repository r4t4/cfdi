const CFDI = require('./index').CFDI;
const debug = require('debug')('cfdi:parse');

const main = async () => {
  const e32 = await new CFDI('./cfd/wrong.32.xml');
  const e33 = await new CFDI('./cfd/wrong.33.xml');
  const good = await new CFDI('./cfd/signed.xml');
  const related = await new CFDI('./cfd/relacionados.xml');

  debug('= = = = = = WRONG 3.2 = = = = = = = =');
  // debug(e32.comprobante());
  debug(e32.relacionados());
  // debug(e32.crypto());
  // debug(e32.uuid());
  // debug(e32.emisor());
  // debug(e32.receptor());
  debug('= = = = = = WRONG 3.2 = = = = = = = =');

  debug('= = = = = = WRONG 3.3 = = = = = = = =');
  // debug(e33.comprobante());
  debug(e33.relacionados());
  // debug(e33.crypto());
  // debug(e33.uuid());
  // debug(e33.emisor());
  // debug(e33.receptor());
  debug('= = = = = = WRONG 3.3 = = = = = = = =');

  debug('= = = = = = RIGHT = = = = = = = =');
  // debug(good.comprobante());
  debug(good.relacionados());
  // debug(good.crypto());
  // debug(good.uuid());
  // debug(good.emisor());
  // debug(good.receptor());
  debug('= = = = = = RIGHT = = = = = = = =');

  debug('= = = = = = RELATED = = = = = = = =');
  // debug(related.comprobante());
  debug(related.relacionados());
  // debug(related.crypto());
  // debug(related.uuid());
  // debug(related.emisor());
  // debug(related.receptor());
  debug('= = = = = = RELATD = = = = = = = =');
};

main();
