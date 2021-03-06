const { db } = require('../../../adapters/db')

module.exports = async (_, { movieId }) => {
  const sql = `
    SELECT
      r.rating,
      u.name,
      u.email 
    FROM 
      ratings AS r 
      INNER JOIN users AS u ON u.id = r.user_id
    WHERE r.movie_id = ${movieId}
  `

  try {
    return await db.query(sql)
  } catch (e) {
    throw new Error(e)
  }
}
