import DB from '../lib/sql-lite'

export async function findOne({ id, email, password }) {
    try {
        const connection = await DB();

        if( email && password ) {
            return await (await connection.prepare(`SELECT * FROM user WHERE email = @email AND password = @password AND deleted_at IS NULL`)).get({email, password});
        }

        return await (await connection.prepare(`SELECT * FROM user WHERE id = ?`)).get(id);

    } catch (e) {
        console.log(e)
    }
}

export async function update({ id, changes }) {
    try {
        const connection = await DB();
        const currentUser = await findOne({id});

        const settings = {
            name: changes.name || currentUser.name,
            password: changes.newPassword || currentUser.password,
            update: (new Date()).toISOString(),
            id
        };

        console.log('settings:', settings)
        return await (await connection.prepare(`UPDATE user SET name = @name, password = @password, update = @update WHERE id = @id AND deleted_at IS NULL`)).run(settings);

    } catch (e) {
        console.log(e)
    }
}