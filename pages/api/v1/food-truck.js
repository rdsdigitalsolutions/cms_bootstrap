import { getSession } from "next-auth/react";
import { search } from '../../../repository/food-truck'

export default async function handler(req, res) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ error: "You must be signed in to view the protected content on this page." });
        return;
    }

    switch (req.method) {
        case 'GET':
            await handleGet(req, res, session);
            break;
    
        default:
            res.status(400).json( { error: 'Invalid request Method!' } );
            break;
    }
}

const handleGet = async (req, res, session) => {
    const results = await search( { food: req.query.food, business: req.query.business, facility: req.query.facility } );
    res.status(200).json( results || [] );
}