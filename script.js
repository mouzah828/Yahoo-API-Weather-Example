$(document).ready(function () {
    function handleWeatherResponse(response, status, xhr) {
        $("#Results").empty();
        var template = $(".weatherTemplate");
        $("#city").val(response.query.results.channel.location.city + ", " + response.query.results.channel.location.region);
        
        var forecast = response.query.results.channel.item.forecast;
        var ms = 0;
        forecast.forEach(function (item) {
            window.setTimeout(function(){
            var clone = template.clone();
            $("#Results").append(clone);
            var date = new Date(item.date);
            clone.find(".weatherHeader").append(date.toLocaleDateString("en-US", { weekday: 'long'}));
            clone.find(".weatherLow").append(item.low);
            clone.find(".weatherHigh").append(item.high);
            clone.find(".weatherText").append(item.text);
            clone.find(".card-img").attr("src", "http://l.yimg.com/a/i/us/we/52/" + item.code + ".gif")
            clone.slideToggle("fast");
            }, ms );
            ms = ms + 100;
        });
    }
    
    function handleLocationResponse(response, status, xhr) {
        $("#city").val(response.query.results.place.locality1.content + ", " + response.query.results.place.admin1.content)
        //console.log(response.query.results);
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
        //console.log("You clicked the button");
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
