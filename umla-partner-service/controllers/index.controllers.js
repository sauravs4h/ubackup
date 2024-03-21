const { login } = require('./partner/admin.controllers');
const { addOutletMenu } = require('./partner/menu.controllers');
const { addOutletDetails } = require('./partner/outlet.controllers');
const { addPartnerDetails } = require('./partner/partner.controllers');

module.exports = { login, addOutletMenu, addOutletDetails, addPartnerDetails };
