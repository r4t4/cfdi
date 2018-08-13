'use strict';

const XML = require('libxmljs');
const FS = require('fs');
const Promise = require('bluebird');

class CFDI {
  // we receive a path, a file or a string
  constructor(xml) {
    let data = xml;
    if (FS.existsSync(xml)) data = FS.readFileSync(xml);
    this.xml = XML.parseXmlString(data, { noblanks: true });
  }

  xpath(localname, attribute) {
    const xpath = `//*[local-name()="${localname}"]`;
    if (!attribute) return xpath;
    return `string(${xpath}/@${attribute})`;
  }

  version() {
    return this.xml.get(this.xpath('Comprobante', 'Version'));
  }
  crypto() {
    const sello_cfd = this.xml.get(this.xpath('Comprobante', 'Sello'));
    const sello_sat = this.xml.get(
      this.xpath('TimbreFiscalDigital', 'SelloSAT')
    );
    const certificado = this.xml.get(this.xpath('Comprobante', 'Certificado'));
    const id_certificado = this.xml.get(
      this.xpath('Comprobante', 'NoCertificado')
    );
    const sat_certificado = this.xml.get(
      this.xpath('TimbreFiscalDigital', 'NoCertificadoSAT')
    );

    // const sello_cfd = this.xml.get(this.xpath('TimbreFiscalDigital', 'SelloCFD'));

    return { sello_cfd, sello_sat, certificado };
  }
  comprobante() {
    const serie = this.xml.get(this.xpath('Comprobante', 'Serie'));
    const folio = this.xml.get(this.xpath('Comprobante', 'Folio'));
    const fecha = this.xml.get(this.xpath('Comprobante', 'Fecha'));
    const moneda = this.xml.get(this.xpath('Comprobante', 'Moneda'));
    const tipo_cambio = this.xml.get(this.xpath('Comprobante', 'TipoCambio'));
    const total = this.xml.get(this.xpath('Comprobante', 'Total'));
    const descuento = this.xml.get(this.xpath('Comprobante', 'Descuento'));
    const tipo = this.xml.get(this.xpath('Comprobante', 'TipoComprobante'));
    const forma = this.xml.get(this.xpath('Comprobante', 'FormaPago'));
    const metodo = this.xml.get(this.xpath('Comprobante', 'MetodoPago'));

    return {
      tipo,
      serie,
      folio,
      fecha,
      total,
      descuento,
      moneda,
      tipo_cambio,
      forma,
      metodo,
    };
  }

  relacionados() {
    return this.xml.get(this.xpath('CfdiRelacionados'));
  }
  emisor() {
    const RFC = this.xml.get(this.xpath('Emisor', 'Rfc'));
    const name = this.xml.get(this.xpath('Emisor', 'Nombre'));
    const regime = this.xml.get(this.xpath('Emisor', 'RegimenFiscal'));

    return { RFC, name, regime };
  }
  receptor() {
    const RFC = this.xml.get(this.xpath('Receptor', 'Rfc'));
    const name = this.xml.get(this.xpath('Receptor', 'Nombre'));

    return { RFC, name };
  }
  conceptos() {
    return this.xml.get(this.xpath('Concepto'));
  }
  impuestos() {
    return this.xml.get(this.xpath('Impuestos'));
  }
  complemento() {
    const uuid = this.xml.get(this.xpath('TimbreFiscalDigital', 'UUID'));
    const fecha = this.xml.get(
      this.xpath('TimbreFiscalDigital', 'FechaTimbrado')
    );

    return this.xml.get(this.xpath('Complemento'));
  }
}

module.exports = {
  CFDI,
};
