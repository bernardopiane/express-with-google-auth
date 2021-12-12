const moment = require("moment");

// Format date to "DD MMMM YYYY"

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
};
