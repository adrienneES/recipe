
const utility = function() {
  const getMessage = req => {
    let message = {};
    if (req.query.error) {
      message = {type:'error', message: req.query.error}
    } else if (req.query.success) {
      message = {type:'success', message: req.query.success}
    } 
    return message;
  };
  return {getMessage: getMessage};
}
module.exports = utility;