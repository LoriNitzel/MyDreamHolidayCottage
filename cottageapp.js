// Input parameters
// In addition to the standard area location parameters, the input parameters detailed below are also accepted.

// Key name	Description
// radius (compulsory)	When providing a latitude and longitude position, this is the radius from the position to find listings. Minimum radius 0.1 miles, maximum radius is 40 miles.
// order_by	The value which the results should be ordered, either "price" (default) or "age" of listing.
// ordering	Sort order for the listings returned. Either "descending" (default) or "ascending".
// listing_status	Request a specific listing status. Either "sale" or "rent".
// include_sold	Whether to include property listings that are already sold in the results when searching for sale listings, either "1" or "0". Defaults to 0.
// include_rented	Whether to include property listings that are already rented in the results when searching for rental listings, either "1" or "0". Defaults to 0.
// minimum_price	Minimum price for the property, in GBP. When listing_status is "sale" this refers to the sale price and when listing_status is "rent" it refers to the per-week price.
// maximum_price	Maximum price for the property, in GBP.
// minimum_beds	The minimum number of bedrooms the property should have.
// maximum_beds	The maximum number of bedrooms the property should have.
// furnished	Specify whether or not the apartment is "furnished", "unfurnished" or "part-furnished". This parameter only applies to searches related to rental property.
// property_type	Type of property, either "houses" or "flats".
// new_homes	Specifying "yes"/"true" will restrict to only new homes, "no"/"false" will exclude them from the results set.
// chain_free	Specifying "yes"/"true" will restrict to chain free homes, "no"/"false" will exclude them from the results set.
// keywords	Keywords to search for within the listing description.
// listing_id	A specific listing_id to request updated details for. This value can be submitted several times to request several listings, but please note that other provided arguments will still be taken into account when filtering listings.
// branch_id	A specific branch_id to request listings for. This branch idea should correspond to a known branch ID from the Zoopla Web site.
// page_number	The page number of results to request, default 1.
// page_size	The size of each page of results, default 10, maximum 100.
// summarised	Specifying "yes"/"true" will return a cut-down entry for each listing with the description cut short and the following fields will be removed: price_change, floor_plan.

//Proven manual API call testing price and keywords etc
//http://api.zoopla.co.uk/api/v1/property_listings.xml?area=England&keywords=period,rural&minimum_beds=2&minimum_price=230000&maximum_price=280000&page_size=100&summarise=true&api_key=qzjg8pa5ga5fb98uajjadznq
var debug = false;
var proxyAPIRoute = 'https://jsonp.afeld.me/?url=';
var zooplAddr = 'http%3A%2F%2Fapi.zoopla.co.uk%2F';
var zoopCallType = 'api%2Fv1%2Fproperty_listings.js';
var zoopAPIKey = '%26api_key%3Dqzjg8pa5ga5fb98uajjadznq';
var zoopStatic = '%26page_size%3D100' + '%26summarised%3Dfalse' + '%26keywords%3Dperiod,rural';

//var zoopLoc = '%3Fpostcode%3DGU2';
// var zoopLoc = '%3Farea%3Ddorset';

var zoopTerms = zoopLoc + '%3Fminimum_beds%3D2' + '%26minimum_price%3D200000' + '%26maximum_price%3D300000' + '%26page_size%3D100' +'%26summarised%3Dtrue';

if (localStorage.getItem('min')) {
	document.querySelector("#InputMinPrice").value = localStorage.getItem('min');
	document.querySelector("#InputMaxPrice").value = localStorage.getItem('max');
	console.log(localStorage.getItem('max'));
}


var requestString = '';
var button = $('button');
var zoopLoc  = 0;
var weatherString = '';
var storedMin = 0;
var storedMax = 0;

$(button).on('click', function(event) {
	
	$('#spinner').ajaxStart(function () {
        $(this).fadeIn('fast');
     });

	event.preventDefault();
	var area = $('#InputLocation').val();
	var minPrice = $('#InputMinPrice').val();
	var maxPrice = $('#InputMaxPrice').val();


	localStorage.setItem('min',minPrice);
	// storedMin = localStorage.getItem('min');
	

	localStorage.setItem('max',maxPrice);
	// storedMax = localStorage.getItem('max');
	
	
	zoopChoices = '%3Farea%3D' + area + '%26minimum_price%3D' + minPrice + '%26maximum_price%3D' + maxPrice; 
	

	requestString = proxyAPIRoute + zooplAddr + zoopCallType + zoopChoices + zoopAPIKey + zoopStatic; 
	// console.log(zoopLoc);
	// console.log(requestString);
	// weatherString = 
	console.log(requestString);
	if(debug){
		requestString = '/homedata.json';
	}

  $.get(requestString, function(data){
    console.log(data);

  
    var listings=data.listing;

    	
    	var $hideArea = $('#glypharea');
		$hideArea.hide();
	

		// var $title = document.createElement('h1');
		// var $text = title.innerText = "Results";

		var $table = $('<table></table>');
		$('#results').append($table);

		listings.forEach(function (listing) {

			// var weatherString = "http://api.worldweatheronline.com/premium/v1/weather.ashx?key=1cce6ebaa3eed9650f3a152915b35&q=SW1&num_of_days=3&format=json";
			var weatherIcon = "";

			var weatherString = "https://api.worldweatheronline.com/free/v2/weather.ashx?key=99bb776d50237467e36764e0ab651&q=" + listing.outcode + "&num_of_days=1&format=json";
			if(debug){
				weatherString = "/data.json";
			}
			var $tr = $('<tr></tr>');
			$table.append($tr);
			
			$tdImg = $('<td></td>');
			$tr.append($tdImg);

			//create $a
			var $a = $("<a href=" + listing.details_url + " target='_blank'></a>");
			$tdImg.append($a);

			$img = $('<img></img>');
			$img.attr("src", listing.image_url);
			$a.append($img);
		
			$tdAddress = $('<td> <div class = "description"> </div></td>');
			
			$tdAddress.children().text(listing.short_description);
			// console.log($tdAddress);
			$tr.append($tdAddress);

			$tdPrice = $('<td></td>');
			$tdPrice.text("£" +listing.price);
			$tr.append($tdPrice);

			$.ajax ( {
  				url: weatherString,
  				type: 'get',
  				dataType: 'json',
  				context: $tr,
  				success: function(weather) {
  					// console.log(this);

  					$('#spinner').hide();

  					weatherIconURL = weather.data.current_condition[0].weatherIconUrl[0].value;
					// console.log(weatherIconURL);

					$tdWeatherImg = $('<td></td>');
					this.append($tdWeatherImg);


					$weatherImg = $('<img class="weather-image"></img>');
					$weatherImg.attr("src", weatherIconURL);
					this.append($weatherImg);
  				}
			});
		});



	});		
});





//take info and feed into Met Office to get weather info. 
//http://api.openweathermap.org/data/2.5/history/city?q=London,UK?id=524901&APPID=4188f040775f57b7f6ca58a851507838

//Zoopla key: qzjg8pa5ga5fb98uajjadznq
//http://api.zoopla.co.uk/api/v1/property_listings.xml?postcode=gu5+0at&api_key=qzjg8pa5ga5fb98uajjadznq

// OpenWeatherMap: 4188f040775f57b7f6ca58a851507838
// Example: http://api.openweathermap.org/data/2.5/weather?q=London,UK?id=524901&APPID=4188f040775f57b7f6ca58a851507838

//Met office key: b772ef50-16e5-47ca-b02e-db226de0f204
//Met office example URL: http://datapoint.metoffice.gov.uk/public/data/val/wxfcs/all/xml/3840?res=3hourly&key=b772ef50-16e5-47ca-b02e-db226de0f204

//worldweather key: 875bb751bdff231df39906e64a16e
//lindsay's worldweather key: 99bb776d50237467e36764e0ab651
//premium key: 1cce6ebaa3eed9650f3a152915b35
//free API URL: 
//HTTP: http://api.worldweatheronline.com/free/v2/weather.ashx?key=875bb751bdff231df39906e64a16e&q=SW1&num_of_days=3&format=json
//premium API URL: 
//http://api.worldweatheronline.com/premium/v1/weather.ashx?key=1cce6ebaa3eed9650f3a152915b35&q=SW1&num_of_days=3&format=json


