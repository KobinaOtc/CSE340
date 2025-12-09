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
        i.inv_id,
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

/* ***************************
 * Get a single message by ID
 * ************************** */
messageModel.getMessageById = async function (message_id) {
  try {
    const sql = `
      SELECT
        m.message_id,
        m.message_subject,
        m.message_body,
        m.message_created,
        m.message_is_read,
        i.inv_make,
        i.inv_model,
        i.inv_id,
        a.account_firstname,
        a.account_lastname,
        a.account_email
      FROM message AS m
      JOIN inventory AS i ON m.inv_id = i.inv_id
      JOIN account AS a ON m.account_from_id = a.account_id
      WHERE m.message_id = $1
    `
    const data = await pool.query(sql, [message_id])
    return data.rows[0] // Return single message object
  } catch (error) {
    console.error("getMessageById error: " + error.message)
    return null
  }
}

/* ***************************
 * Toggle read status of a message
 * ************************** */
messageModel.markMessageRead = async function (message_id, is_read) {
  try {
    const sql = `
      UPDATE public.message 
      SET message_is_read = $1 
      WHERE message_id = $2 
      RETURNING *
    `
    const result = await pool.query(sql, [is_read, message_id])
    return result.rowCount // Should be 1 on success
  } catch (error) {
    console.error("markMessageRead error: " + error.message)
    return 0 
  }
}

/* ***************************
 * Delete a message
 * ************************** */
messageModel.deleteMessage = async function (message_id) {
  try {
    const sql = "DELETE FROM public.message WHERE message_id = $1"
    const data = await pool.query(sql, [message_id])
    return data.rowCount // Should be 1 on success
  } catch (error) {
    console.error("deleteMessage error: " + error.message)
    return 0
  }
}

module.exports = messageModel