import database from "./../food-truck-data.json" assert { type: 'json' };

export async function search({ food, business, facility }) {
    try {
        return database.filter( ( data ) => {
            return (data.FoodItems||'').indexOf( (  food || data.FoodItems ) ) > -1
            && data.Applicant === ( business || data.Applicant )
            && data.FacilityType === ( facility || data.FacilityType )
        } );
    } catch (e) {
        console.log(e)
        return
    }
}

export async function aggregateFilters() {
    try {
        return {
            food: [ ... new Set( database.reduce( (accumulator, current) => {
                accumulator = accumulator.concat(( current.FoodItems || '').split(':') );
                return accumulator;
            }, [] ) ) ].filter( (data) => !!data ),
            business: [ ... new Set( database.reduce( (accumulator, current) => {
                accumulator.push(current.Applicant);
                return accumulator;
            }, [] ) ) ].filter( (data) => !!data ),
            facility: [ ... new Set( database.reduce( (accumulator, current) => {
                accumulator.push(current.FacilityType)
                return accumulator;
            }, [] ) ) ].filter( (data) => !!data )
        }
    } catch (e) {
        console.log(e)
        return
    }
}