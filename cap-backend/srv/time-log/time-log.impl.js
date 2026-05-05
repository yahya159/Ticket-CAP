'use strict';

const TimeLogDomainService = require('./time-log.domain.service');

module.exports = (srv) => {
  const domain = new TimeLogDomainService(srv);

  srv.before('READ', 'TimeLogs', (req) => domain.beforeRead(req));
  srv.before('CREATE', 'TimeLogs', (req) => domain.beforeCreate(req));
  srv.before('UPDATE', 'TimeLogs', (req) => domain.beforeUpdate(req));
  srv.before('DELETE', 'TimeLogs', (req) => domain.beforeDelete(req));
  srv.on('sendToStraTIME', 'TimeLogs', (req) => domain.sendToStraTIME(req));
};

module.exports.primaryEntity = 'TimeLogs';
