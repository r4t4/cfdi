'use strict';

const CFDI = require('./index').CFDI;

const one = new CFDI('./cfd/min-payment.xml');
const two = new CFDI('./cfd/payment.xml');
const three = new CFDI('./cfd/signed.xml');

