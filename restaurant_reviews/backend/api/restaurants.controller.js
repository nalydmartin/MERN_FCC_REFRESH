import RestaurantsDAO from "../dao/restaurantsDAO.js";


export default class RestaurantsController {

    static async apiGetRestaurants(req, res, next) {
        // Check to see if the restaurantsPerPage exists in the url query, if exists, convert to an integer, or default to 20
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20;

        // Check to see if a page number was given in the url query, or default to page 0
        const page = req.query.page ? parseInt(req.query.page, 10) : 0;

        // Check to see if any filters are in the url search query
        let filters = {};

        if(req.query.cuisine) {
            filters.cuisine = req.query.cuisine;
        } else if(req.query.zipcode) {
            filters.zipcode = req.query.zipcode;
        } else if(req.query.name) {
            filters.name = req.query.name;
        }

        // Call the getRestaurants function to get a list of all the restaurants from the given filters
        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters,
            page,
            restaurantsPerPage
        })

        // Return a response with all the queried information the user requested
        let response = {
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants
        }
        res.json(response);
    }
}