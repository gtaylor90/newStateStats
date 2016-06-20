console.log('hello world')

// METADATA URL EXAMPLE
// http://openstates.org/api/v1/metadata/tx/?apikey=0e85724a8f924c6aba8bd576df364eb7

// LEGISLATOR URL EXAMPLE
// http://openstates.org/api/v1/legislators/?state=tx&apikey=0e85724a8f924c6aba8bd576df364eb7

// define some global variables
var legislatorsUrlRoot = "http://openstates.org/api/v1/legislators/",
    stateUrlRoot = "http://openstates.org/api/v1/metadata/",
    apiKey = "0e85724a8f924c6aba8bd576df364eb7",
    legislatorParams = {
        state: 'tx',
        apikey: apiKey,
        per_page: 20
    },
    stateParams = {
        apikey: apiKey
    },
    containerNode = document.querySelector('#container')


var stateQuery = function(stateInput) {
    // legislatorParam
    var stateUrlRoot = "http://openstates.org/api/v1/metadata/"
    stateUrlRoot += stateInput + '/'
    legislatorParams.state = stateInput


    var legislatorsUrlFull = legislatorsUrlRoot + genParamString(legislatorParams)
    var stateUrlFull = stateUrlRoot + genParamString(stateParams)


    var legislatorPromise = $.getJSON(legislatorsUrlFull)
    var statePromise = $.getJSON(stateUrlFull)
        // hand our functions over to the promise objects, so they 
        // can be invoked when the data is ready.
    statePromise.then(stateDataHandler)
    legislatorPromise.then(legislatorDataHandler)

}

var searchFunction = function(eventObj) {
    // if enter key is pressed
    if (eventObj.keyCode === 13) {
        // use what the user typed
        var inputElement = eventObj.target
        var inputValue = inputElement.value
        console.log(inputValue)
            // make a custom query with the input value
        stateQuery(inputValue)
        inputNode.value = ''
    }
}

var inputNode = document.querySelector('input')

inputNode.addEventListener('keydown', searchFunction)

var genParamString = function(paramObject) {
    var outputString = '?'
    for (var key in paramObject) {
        outputString += key + '=' + paramObject[key] + '&'
    }
    return outputString.substr(0, outputString.length - 1)
}

// build the urls we need

// var legislatorsUrlFull = legislatorsUrlRoot + genParamString(legislatorParams)
// var stateUrlFull = stateUrlRoot + genParamString(stateParams)

// request data from each url, store the promises that are returned

// var legislatorPromise = $.getJSON(legislatorsUrlFull)
// var statePromise = $.getJSON(stateUrlFull)


// define functions that will handle the data when it's ready. note that
// each of these functions takes a response object as input. that's because
// when the promise object invokes them, it will pass as input the response 
// to our request.
var stateDataHandler = function(responseObject) {
    console.log('eyyyy we got some state data!!!')
    console.log(responseObject)

    // build an html string
    var htmlString = ''
    var stateName = responseObject.name,
        legislatureName = responseObject.legislature_name,
        legislatureUrl = responseObject.legislature_url

    htmlString += '<p class="stateName">state: ' + stateName + '</p>'
    htmlString += '<p class="legName">name: ' + legislatureName + '</p>'
    htmlString += '<a href="' + legislatureUrl + '">website</a>'

    // write it into the container
    var leftContainer = document.querySelector("#leftCol")
    leftContainer.innerHTML = htmlString
}

var legislatorDataHandler = function(legislatorsArray) {
    console.log('yooo we got some legislator data, i guess')
        // "full_name": "Dan Patrick",
        // "+district_address": " 11451 Katy Fwy, Suite 209\nHouston, TX 77079\n(713) 464-0282",
        // "photo_url": "http://www.legdir.legis.state.tx.us/FlashCardDocs/images/Senate/small/A1430.jpg",

    var htmlCards = ''
    for (var i = 0; i < 10; i++) {
        var legObject = legislatorsArray[i],
            name = legObject.full_name,
            addy = legObject['+district_address'],
            imgSrc = legObject.photo_url
        if (addy === undefined) {
            addy = "not listed"
        }
        htmlCards += '<div class="legCard">'
        htmlCards += '<div class="portrait">'
        htmlCards += '<img src="' + imgSrc + '">'
        htmlCards += '</div>'
        htmlCards += '<div class="legData">'
        htmlCards += '<h2 class="name">name: ' + name + '</h2>'
        htmlCards += '<p class="address">address: ' + addy + '</p>'
        htmlCards += '</div>'
        htmlCards += '</div>'
    }
    var rightContainer = document.querySelector('#rightCol')
    rightContainer.innerHTML = htmlCards
}

var StatesRouter = Backbone.Router.extend({
    routes: {
        "home": "showHomePage",
        "search/:state": "doStateSearch"
    },
    showHomePage: function() {
        containerNode.innerHTML = "<p>Welcome to State Stats, enter your state abbreviation in the search bar </p>"
    },

})

var rtr = new StatesRouter()

// 
Backbone.history.start()



