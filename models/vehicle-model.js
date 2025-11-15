const pool = require('../database')

// Get single details of the vehicle
async function getVehicleById(vehicle_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory 
            WHERE inv_id = $1`,
            [vehicle_id]
        )
        return data.rows[0]
    } catch {
        console.error('getVehicleById error ' + error )
        return []
    }
}

module.exports = {getVehicleById}