const connection = require('../configs/db')
module.exports = {
      insertMessage: (data) => {
        return new Promise((resolve, reject) => {
          connection.query('INSERT INTO messages SET ?', data, (err, result) => {
            if (!err) {
              resolve(result)
            } else {
              reject(new Error(err))
            }
          })
        })
      },
}