# Uber Simulator

RESTful API that emulates a ride share service.<br />
**GET**, **POST**, and **DELETE** requests can be made.<br />
Google Maps API is implemented to locate drivers/riders and find the
distance between them.

Requests can be made to:<br />

* Rider Controller
  * GET ALL RIDERS (GET)
  * RIDER CAN SELECT DRIVER BY ID (POST)
  * RIDER CAN SET LOCATION (POST)
  * RIDER CAN SET DESTINATION (POST)
  * RIDER CAN SEE ALL NEARBY DRIVERS (GET)
  * RIDER CAN SEE LOCATION OF THE ASSIGNED DRIVER (GET)
  * ALLOW RIDER TO LEAVE TIP (POST)
  * ALLOW RIDER TO LEAVE RATING BETWEEN 0-5 (POST)
  
* Driver Controller
  * GET ASSIGNED RIDER LOCATION
  * GET ASSIGNED RIDER DESTINATION
  * UPDATE DRIVER POSITION (PUT)
  * UPDATE DRIVER AVAILABILITY (PUT)
  * VIEW DRIVER WALLET (GET)
  
* Admin Controller
  * ADD A NEW RIDER (POST)
  * REMOVE RIDER WITH ID (DELETE)
  * ADD A NEW DRIVER (POST)
  * REMOVE DRIVER WITH ID (DELETE)
