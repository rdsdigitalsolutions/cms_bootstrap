import DB from '../lib/sql-lite'

export async function findOne({ id, email, password }) {
    try {
        const connection = await DB();

        if( email && password ) {
            return await (await connection.prepare(`SELECT * FROM user WHERE email = ? AND password = ? AND deleted_at IS NULL`)).get(email, password);
        }

        return await (await connection.prepare(`SELECT * FROM user WHERE id = ?`)).get(id);

    } catch (e) {
        console.log(e)
    }
}