import express from 'express';
import RestaurantCtrl from './restaurants.controller.js';

const router = express.Router();

router.route('/').get(RestaurantCtrl.apiGetRestaurants);

export default router;