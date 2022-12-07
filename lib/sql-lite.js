// https://github.com/WiseLibs/better-sqlite3/blob/HEAD/docs/api.md
import Database from 'better-sqlite3';

let db;

const users = [
    { id: null, name: 'Test Doe', email: 'test@testing.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg' },
    { id: null, name: 'Jhoe Doe', email: 'jhoedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg' },
    { id: null, name: 'Marie Doe', email: 'mariedoe@gmail.com', password: 'rSnsw8mD5YEb', image: 'test_profile_picture.jpeg' },
];

export default async function getDb( dbName ) {
    try {
        db = new Database( dbName || 'cmsBoostrap.db');
        db.pragma('journal_mode = WAL');

        process.on('exit', () => db.close());
        process.on('SIGHUP', () => process.exit(128 + 1));
        process.on('SIGINT', () => process.exit(128 + 2));
        process.on('SIGTERM', () => process.exit(128 + 15));

        const checkTables = await (await db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name='user';`)).get();
        
        if(!checkTables) {
            await migrateUser( db );
            await migrateProduct( db );
        }
        
        return db;
    } catch(e){
        console.log(e)
    } 
}

const migrateUser = async ( db ) => {
    await ( await db.prepare(`CREATE TABLE IF NOT EXISTS 'user' (
        'id' INTEGER PRIMARY KEY,
        'name' varchar(200) NOT NULL,
        'email' varchar(250) NOT NULL,
        'password' varchar(250) NOT NULL,
        'image' varchar(250) NULL,
        'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        'deleted_at' TIMESTAMP NULL
        )`) ).run();

    const insert = await db.prepare(`REPLACE INTO user (id, name, email, password, image) VALUES (@id, @name, @email, @password, @image)`);
    const insertMany = await db.transaction( async (users) => {
        for (const user of users) await insert.run(user);
    });

    await insertMany(users);
}

const migrateProduct = async ( db ) => {
    await ( await db.prepare(`CREATE TABLE IF NOT EXISTS 'product' (
        'id' INTEGER PRIMARY KEY,
        'user_id' INTEGER NOT NULL,
        'title' varchar(250) NOT NULL,
        'description' varchar(200) NOT NULL,
        'price' DECIMAL(8,2) NOT NULL,
        'image' varchar(250) NULL,
        'created_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        'updated_at' TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        'deleted_at' TIMESTAMP NULL
        )`) ).run();

    const insert = await db.prepare(`REPLACE INTO product (id, user_id, title, description, price, image) VALUES (@id, @userId, @title, @description, @price, @image)`);
    const insertMany = await db.transaction( async (data) => {
        for (const unity of data) await insert.run(unity);
    });

    for (const key in users) {
        if (Object.hasOwnProperty.call(users, key)) {
            // Documentation: https://dummyjson.com/
            const apiResponse = await fetch('https://dummyjson.com/products').then(res => res.json());
            const products = apiResponse.products
                .map( (product) => ({ 
                    id: null, 
                    userId: Number(key) + 1 , 
                    title: product.title, 
                    description: product.description, 
                    price: product.price, 
                    image: product.thumbnail
                }) );
            
            console.log('apiResponse', apiResponse, products)
            await insertMany(products);
        }
    }
}