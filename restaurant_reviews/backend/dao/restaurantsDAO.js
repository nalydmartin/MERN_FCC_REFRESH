// Create a variable to store a reference point to Restaurants in the database
let restaurants

export default class RestaurantsDAO {

    // Inject Database method to connect to database when server starts. Gets a reference to our restaurant database.
    static async injectDB(conn) {
        // If the reference already exists
        if (restaurants) {
            return
        }
        // IF THERE IS NO REFERENCE ESTABLISHED
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection('restaurants')
        } catch (e) {
            console.error(
                `Unable to establish a collection handle in restaurantsDAO: ${e}.`,
            )
        }
    }

    // Get restaurants function: will be called to return a list of all the restaurants in the database.
    static async getRestaurants({
        // Filters: sort things by name, zip, cuisine, etc
        filters = null,
        // How many restaurants per page
        page = 0,
        restaurantsPerPage = 20
    } = {}) {
        // query stays empty unless given filters
        let query

        // $eq == equals
        // $text == search any text for a given name --- text search needs to be setup in mongodb atlas
        if(filters) {
            if('name' in filters) {
                query = {$text: { $search: filters['name'] }}
            } else if ('cuisine' in filters) {
                query = {'cuisine': { $eq: filters['cuisine'] }}
            } else if ('zipcode' in filters) {
                query = {'address.zipcode': { $eq: filters['zipcode'] }}
            }
        }


        let cursor

        // Finds all the restaurants in the database that match the query
        try{
            cursor = await restaurants
                .find(query)
        } catch (e) {
            console.error(`Unable to issue find command, ${e}.`)
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        // If there is no error: limit the results with the given query. Skip to the page with matching query.
        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)

        try{
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList, totalNumRestaurants }
        } catch (e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents, ${e}`
            )
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }
    }


}