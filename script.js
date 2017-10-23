$(document).ready(function () {
    function handleWeatherResponse(response, status, xhr) {
        $("#Results").empty();
        var template = $(".weatherTemplate");
        $("#Results").append("<p>" + response.query.results.channel.description + "</p>")
        var forecast = response.query.results.channel.item.forecast;
        forecast.forEach(function (item) {
            var clone = template.clone();
            $("#Results").append(clone);
            clone.find(".weatherHeader").append(item.date);
            clone.find(".weatherLow").append(item.low);
            clone.find(".weatherHigh").append(item.high);
            clone.find(".weatherText").append(item.text);
            clone.show();
        });
    }
    
    function handleLocationResponse(response, status, xhr) {
        $("#city").val(response.query.results.place.locality1.content + ", " + response.query.results.place.admin1.content)
        console.log(response.query.results);
        weatherButtonClicked();
    }
    
    function handlePositionError(error){
        
    }
    
    function handlePositionSuccess(success){
        success.coords.latitude
        
        var locationUrl = "https://query.yahooapis.com/v1/public/yql?q=SELECT * FROM geo.places WHERE text=\"(" + success.coords.latitude + "," + success.coords.longitude + ")\"&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        
        $.getJSON(locationUrl).then(handleLocationResponse);
        
    }

    function weatherButtonClicked(event) {
        console.log("You clicked the button");
        var city = $("#city").val();
        if (!city) {
            city = "Fargo, ND";
        }
        var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22" + city + "%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
        $.getJSON(url, handleWeatherResponse);
    }
    
    function locationButtonClicked(event) {
        navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError)
        
    }
    
    $("#WeatherButton").click(weatherButtonClicked);
    
    $("#DetectLocation").click(locationButtonClicked);
})