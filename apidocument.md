// Page 1  I require Four different urls on 1st page
> List of city
> (Get) http://localhost:9100/location
> list of restaurant
> (Get) http://localhost:9100/restaurants
> Restaurant on the basis of city 
> (Get) 
> List of QuickSearch
> (Get) http://localhost:9100/mealType

// Page 2
> List of restaurants on the basis of meal
> (Get)  http://localhost:9100/restaurants?mealId=5 http://localhost:9100/restaurants?mealId=5&stateId=2
> Filter on basis of cuisine
> (Get) http://localhost:9100/filter/1?cuisineId=5
> Filter on basis of cost
> (Get)  http://localhost:9100/filter/1?lcost=700&hcost=1200
> Sort on basis of cost
> (Get) http://localhost:9100/filter/1?lcost=500&hcost=1200&sort=-1

// Page3
> Details of the restaurant
> (Get) http://localhost:9100/details/5
> Menu of the Restaurant
> (Get)http://localhost:9100/menu/7

// Page4
> Menu details (selected items added in cart)
> (Post) 
> Place order
> (Post) 
 
// Page5
> List of order placed
> (Get)http://localhost:9100/orders
> List of order placed by particular user
> (Get) 
> Update order 
> (Post) localhost:9100/updateOrder/2
 {
  "status":"TAX_FAIL",
  "bank_name":"AXIS BANK",
  "date":"29/2/20"
}

//apart from this we make some more api's
//// Delete orders
>(Delete)localhost:9100/deleteOrder/629c1dfd843a4e51fa89cf03
