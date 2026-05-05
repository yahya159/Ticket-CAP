'use strict';

const ImputationPeriodDomainService = require('./imputation-period.domain.service');

module.exports = (srv) => {
  const domain = new ImputationPeriodDomainService(srv);

  srv.before('READ', 'ImputationPeriods', (req) => domain.beforeRead(req));
  srv.before('CREATE', 'ImputationPeriods', (req) => domain.beforeCreate(req));
  srv.before('UPDATE', 'ImputationPeriods', (req) => domain.beforeUpdate(req));
  srv.before('DELETE', 'ImputationPeriods', (req) => domain.beforeDelete(req));
  srv.on('submit', 'ImputationPeriods', (req) => domain.submit(req));
  srv.on('validate', 'ImputationPeriods', (req) => domain.validate(req));
  srv.on('rejectEntry', 'ImputationPeriods', (req) => domain.rejectEntry(req));
  srv.on('sendToStraTIME', 'ImputationPeriods', (req) => domain.sendToStraTIME(req));
};

module.exports.primaryEntity = 'ImputationPeriods';
