'use strict';

const FS = require('fs');

const XML = require('libxmljs');
const XML2JS = require('xml2js');
const XPATH = require('xml2js-xpath');
const Promise = require('bluebird');
const _map = require('lodash/map');
const _each = require('lodash/each');

const debug = require('debug')('cfdi');
const error = require('debug')('app:error');

const parseXML = Promise.promisify(XML2JS.parseString);

class CFDI {
  /**
   *  Comprobante Fiscal Digital SAT
   *
   * @param {string} xmlORpath
   */
  constructor(xmlORpath) {
    return new Promise((resolve, reject) => {
      // initialize for all CFD's
      this.v = false;
      // process the data
      let data = xmlORpath;
      const self = this;

      if (FS.existsSync(xmlORpath)) {
        data = FS.readFileSync(xmlORpath);
      }
      // we might break on some documents so we're checking first
      try {
        this.xml = XML.parseXmlString(data, {
          noblanks: true,
          recover: true,
          noerror: true,
          nonet: true,
          nsclean: false,
          dtdload: false,
          dtdvalid: false,
          old: true,
        });
        // now we know we can access the CFD's version
        this.v = this.version();
        debug(`CFDI:${this.v}`);
        resolve(this);
        // we might not get home the easy way
      } catch (e) {
        this.xml = false;
        debug(e.message);
        parseXML(data)
          .then((json) => {
            self.json = json;
            self.v = self.version();
            debug(`CFDI:${this.v}`);
            resolve(self);
          })
          .catch(reject);
      }
    });
  }

  xpath(localname, attribute) {
    const xpath = `//*[local-name()="${localname}"]`;
    if (!attribute) return xpath;
    return `string(${xpath}/@${attribute})`;
  }

  is33() {
    return this.v == '3.3';
  }
  is32() {
    return this.v == '3.2';
  }

  version() {
    if (!this.xml) {
      const version = XPATH.evalFirst(this.json, '//cfdi:Comprobante', 'Version');
      return version || XPATH.evalFirst(this.json, '//cfdi:Comprobante', 'version');
    } else {
      const version = this.xml.get(this.xpath('Comprobante', 'Version'));
      return version || this.xml.get(this.xpath('Comprobante', 'version'));
    }
  }

  comprobante() {
    if (!this.xml) {
      const serie = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Serie' : 'serie');
      const folio = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Folio' : 'folio');
      const fecha = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Fecha' : 'fecha');
      const moneda = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Moneda' : 'Moneda');
      const tipo_cambio =
        XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'TipoCambio' : 'tipoDeCambio') || null;
      const total = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Total' : 'total');
      const descuento =
        XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Descuento' : 'descuento') || null;
      const tipo = XPATH.evalFirst(
        this.json,
        '//cfdi:Comprobante',
        this.is33() ? 'TipoDeComprobante' : 'tipoDeComprobante'
      );
      const forma = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'FormaPago' : 'formaDePago');
      const metodo = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'MetodoPago' : 'metodoDePago');

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
    } else {
      const serie = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Serie' : 'serie'));
      const folio = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Folio' : 'folio'));
      const fecha = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Fecha' : 'fecha'));
      const moneda = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Moneda' : 'Moneda'));
      const tipo_cambio = this.xml.get(this.xpath('Comprobante', this.is33() ? 'TipoCambio' : 'tipoDeCambio')) || null;
      const total = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Total' : 'total'));
      const descuento = this.xml.get(this.xpath('Comprobante', this.is33() ? 'Descuento' : 'descuento')) || null;
      const tipo = this.xml.get(this.xpath('Comprobante', this.is33() ? 'TipoDeComprobante' : 'tipoDeComprobante'));
      const forma = this.xml.get(this.xpath('Comprobante', this.is33() ? 'FormaPago' : 'formaDePago'));
      const metodo = this.xml.get(this.xpath('Comprobante', this.is33() ? 'MetodoPago' : 'metodoDePago'));

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
  }

  crypto() {
    if (!this.xml) {
      const sello_cfd = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Sello' : 'sello');
      const sello_sat = XPATH.evalFirst(this.json, '//tfd:TimbreFiscalDigital', this.is33() ? 'SelloSAT' : 'selloSAT');
      const certificado = XPATH.evalFirst(this.json, '//cfdi:Comprobante', this.is33() ? 'Certificado' : 'certificado');
      const no_certificado_cfd = XPATH.evalFirst(
        this.json,
        '//cfdi:Comprobante',
        this.is33() ? 'NoCertificado' : 'noCertificado'
      );
      const no_certificado_sat = XPATH.evalFirst(
        this.json,
        '//tfd:TimbreFiscalDigital',
        this.is33() ? 'NoCertificadoSAT' : 'noCertificadoSAT'
      );

      return {
        sello_cfd,
        sello_sat,
        certificado,
        no_certificado_cfd,
        no_certificado_sat,
      };
    } else {
      const sello_cfd = this.xml.get(this.xpath('Comprobante', 'Sello'));
      const sello_sat = this.xml.get(this.xpath('TimbreFiscalDigital', 'SelloSAT'));
      const certificado = this.xml.get(this.xpath('Comprobante', 'Certificado'));
      const no_certificado_cfd = this.xml.get(this.xpath('Comprobante', 'NoCertificado'));
      const no_certificado_sat = this.xml.get(this.xpath('TimbreFiscalDigital', 'NoCertificadoSAT'));

      return {
        sello_cfd,
        sello_sat,
        certificado,
        no_certificado_cfd,
        no_certificado_sat,
      };
    }
  }

  relacionados() {
    let relacionados = [];
    if (!this.xml) {
      const parent = XPATH.find(this.json, '//cfdi:CfdiRelacionados');
      if (parent) {
        const tipo = XPATH.evalFirst(
          this.json,
          '//cfdi:CfdiRelacionados',
          this.is33() ? 'TipoRelacion' : 'tipoDeRelacion'
        );
        const raw = XPATH.find(this.json, '//cfdi:CfdiRelacionados/cfdi:CfdiRelacionado/@UUID');
        relacionados = _map(raw, (item) => item.$.UUID);

        return { tipo, relacionados };
      }
    } else {
      const parent = this.xml.get(this.xpath('CfdiRelacionados'));
      if (parent) {
        const tipo = this.xml.get(this.xpath('CfdiRelacionados', this.is33() ? 'TipoRelacion' : 'tipoDeRelacion'));
        relacionados = _map(parent.childNodes(), (item) => item.attr('UUID').value());

        return { tipo, relacionados };
      }
    }
    return null;
  }

  emisor() {
    if (!this.xml) {
      const rfc = XPATH.evalFirst(this.json, '//cfdi:Emisor', this.is33() ? 'Rfc' : 'rfc');
      const nombre = XPATH.evalFirst(this.json, '//cfdi:Emisor', this.is33() ? 'Nombre' : 'nombre');
      const regimen =
        XPATH.evalFirst(this.json, '//cfdi:Emisor', this.is33() ? 'RegimenFiscal' : 'regimenFiscal') || null;

      return { rfc, nombre, regimen };
    } else {
      const rfc = this.xml.get(this.xpath('Emisor', this.is33() ? 'Rfc' : 'rfc'));
      const nombre = this.xml.get(this.xpath('Emisor', this.is33() ? 'Nombre' : 'nombre'));
      const regimen = this.xml.get(this.xpath('Emisor', this.is33() ? 'RegimenFiscal' : 'regimenFiscal')) || null;

      return { rfc, nombre, regimen };
    }
  }

  receptor() {
    if (!this.xml) {
      const rfc = XPATH.evalFirst(this.json, '//cfdi:Receptor', this.is33() ? 'Rfc' : 'rfc');
      const nombre = XPATH.evalFirst(this.json, '//cfdi:Receptor', this.is33() ? 'Nombre' : 'nombre');

      return { rfc, nombre };
    } else {
      const rfc = this.xml.get(this.xpath('Receptor', this.is33() ? 'Rfc' : 'rfc'));
      const nombre = this.xml.get(this.xpath('Receptor', this.is33() ? 'Nombre' : 'nombre'));

      return { rfc, nombre };
    }
  }

  conceptos() {
    return null;
    // if (!this.xml) return null;
    // return this.xml.get(this.xpath('Concepto'));
  }

  impuestos() {
    return null;
    // if (!this.xml) return null;
    // return this.xml.get(this.xpath('Impuestos'));
  }

  uuid() {
    if (!this.xml) {
      return XPATH.evalFirst(this.json, '//cfdi:Complemento/tfd:TimbreFiscalDigital', 'UUID');
    } else {
      const complemento = this.xpath('Complemento');
      const timbre = this.xpath('TimbreFiscalDigital');

      return this.xml.get(`string(${complemento}${timbre}/@UUID)`);
    }
  }

  complemento() {
    return null;
    // if (!this.xml) return null;
    // const uuid = this.xml.get(this.xpath('TimbreFiscalDigital', 'UUID'));
    // const fecha = this.xml.get(this.xpath('TimbreFiscalDigital', 'FechaTimbrado'));

    // return { uuid, fecha };
  }
}

module.exports = {
  CFDI,
};
