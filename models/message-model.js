const pool = require('../database')

const messageModel = {}

/* ***************************
 * Add a new client message/inquiry
 * ************************** */
messageModel.addInquiry = async function (
  message_subject,
  message_body,
  inv_id,
  account_from_id
) {
  try {
    const sql = `
      INSERT INTO public.message 
        (message_subject, message_body, inv_id, account_from_id)
      VALUES 
        ($1, $2, $3, $4) 
      RETURNING *
    `
    const values = [
      message_subject,
      message_body,
      inv_id,
      account_from_id,
    ]
    
    // Use SQL Prepared Statements
    const result = await pool.query(sql, values)
    return result.rowCount // Should be 1 on success
  } catch (error) {
    // Error Handling
    console.error("addInquiry error: " + error.message)
    return 0 
  }
}

/* ***************************
 * Get all messages for an Employee/Admin (Inbox)
 * ************************** */
messageModel.getMessages = async function () {
  try {
    // Join with account and inventory to get useful display data
    const sql = `
      SELECT
        m.message_id,
        m.message_subject,
        m.message_body,
        m.message_created,
        m.message_is_read,
        i.inv_make,
        i.inv_model,
        a.account_firstname,
        a.account_lastname
      FROM message AS m
      JOIN inventory AS i ON m.inv_id = i.inv_id
      JOIN account AS a ON m.account_from_id = a.account_id
      ORDER BY message_created DESC
    `
    const data = await pool.query(sql)
    return data.rows
  } catch (error) {
    console.error("getMessages error: " + error.message)
    return []
  }
}

module.exports = messageModel