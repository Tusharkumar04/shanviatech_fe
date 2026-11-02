const roles = ['employee', 'admin', 'client'];

const roleRights = new Map();
roleRights.set(roles[0], ['manageEmployee']);
roleRights.set(roles[1], ['manageAdmin']);
roleRights.set(roles[2], ['manageClient']);

module.exports = {
  roles,
  roleRights,
};