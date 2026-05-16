'use strict';

const cds = require('@sap/cds');

class AuthRepo {
  async findUserByEmail(email) {
    const users = await cds.db.run(
      SELECT.from('sap.performance.dashboard.db.Users')
        .columns(
          'ID',
          'name',
          'email',
          'role',
          'active',
          'availabilityPercent',
          'teamId',
          'avatarUrl'
        )
        .where({ email })
    );
    const user = users[0];
    if (user && (user.active === true || user.active === 'true' || user.active === 1 || user.active === '1')) {
      return user;
    }
    return null;
  }

  async listActiveUsers() {
    const users = await cds.db.run(
      SELECT.from('sap.performance.dashboard.db.Users')
        .columns('ID', 'name', 'email', 'role', 'active')
    );
    const result = users.filter(u => u.active === true || u.active === 'true' || u.active === 1 || u.active === '1');
    console.log('[AuthRepo] listActiveUsers returned:', result?.length ?? 0, 'users');
    return result;
  }
}

module.exports = AuthRepo;
