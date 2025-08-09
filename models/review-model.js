const pool = require("../database/")

async function deleteReview(vehicle_id, account_id) {
  const sql = `
    DELETE FROM reviews WHERE vehicle_id = $1 AND account_id = $2;
  `
  return pool.query(sql, [vehicle_id, account_id])
}

async function hasUserReviewed(vehicle_id, account_id) {
  const sql = `
    SELECT 1 FROM reviews WHERE vehicle_id = $1 AND account_id = $2 LIMIT 1;
  `
  const result = await pool.query(sql, [vehicle_id, account_id])
  return result.rowCount > 0
}


async function addReview(vehicle_id, account_id, rating, comment) {
  const sql = `
    INSERT INTO reviews (vehicle_id, account_id, rating, comment)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `
  return pool.query(sql, [vehicle_id, account_id, rating, comment])
}

async function getReviewsByVehicle(vehicle_id) {
  const sql = `
    SELECT r.*, a.account_firstname, a.account_lastname
    FROM reviews r
    JOIN account a ON r.account_id = a.account_id
    WHERE r.vehicle_id = $1
    ORDER BY r.created_at DESC;
  `
  return pool.query(sql, [vehicle_id])
}

async function updateReview(vehicle_id, account_id, rating, comment) {
  const sql = `
    UPDATE reviews
    SET rating = $3, comment = $4, created_at = NOW()
    WHERE vehicle_id = $1 AND account_id = $2
    RETURNING *;
  `;
  return pool.query(sql, [vehicle_id, account_id, rating, comment]);
}

module.exports = { addReview, getReviewsByVehicle, hasUserReviewed, deleteReview, updateReview }
