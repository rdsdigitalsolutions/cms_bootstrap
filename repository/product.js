import DB from '../lib/sql-lite'

export async function getAll({ userId, searchTerm }) {
    try {
        const connection = await DB();

        if(searchTerm) {
            const term = String(searchTerm).toLowerCase().trim()
            return await (await connection.prepare(`SELECT * FROM product WHERE user_id = ? AND deleted_at IS NULL AND ( LOWER( title ) like ? OR LOWER( description ) like ?) ;`)).all(userId, `%${term}%`, `%${term}%`);
        }

        return await (await connection.prepare(`SELECT * FROM product WHERE user_id = ? AND deleted_at IS NULL`)).all(userId);
    } catch (e) {
        console.log(e)
        return
    }
}