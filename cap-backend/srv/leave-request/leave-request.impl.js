'use strict';

const LeaveRequestDomainService = require('./leave-request.domain.service');

module.exports = (srv) => {
  const domain = new LeaveRequestDomainService(srv);

  srv.before('READ', 'LeaveRequests', (req) => domain.beforeRead(req));
  srv.before('CREATE', 'LeaveRequests', (req) => domain.beforeCreate(req));
  srv.before('UPDATE', 'LeaveRequests', (req) => domain.beforeUpdate(req));
  srv.before('DELETE', 'LeaveRequests', (req) => domain.beforeDelete(req));
};

module.exports.primaryEntity = 'LeaveRequests';
