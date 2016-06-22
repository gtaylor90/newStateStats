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
        apikey: apiKey
    },
    stateParams = {
        apikey: apiKey
    },
    containerNode = document.querySelector('#container')

var doStateRequest = function(stateInput) {
    // incorporate state input into urls and params
    var stateUrlWithInput = stateUrlRoot + stateInput + '/'

    // build the urls we need
    var stateUrlFull = stateUrlWithInput + genParamString(stateParams)

    // request data from each url, store the promises that are returned
    var statePromise = $.getJSON(stateUrlFull)

    return statePromise
}

var doLegislatorsRequest = function(stateInput) {
    // add stateinput to the legislator params object under the key "state"
    legislatorParams.state = stateInput

    // build the urls we need
    var legislatorsUrlFull = legislatorsUrlRoot + genParamString(legislatorParams)

    // request data from each url, store the promises that are returned
    var legislatorPromise = $.getJSON(legislatorsUrlFull)

    return legislatorPromise
}


var genParamString = function(paramObject) {
    var outputString = '?'
    for (var key in paramObject) {
        outputString += key + '=' + paramObject[key] + '&'
    }
    return outputString.substr(0,outputString.length - 1)
}

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
    for (var i = 0; i < 10; i ++) {
        var legObject = legislatorsArray[i],
            name = legObject.full_name,
            addy = legObject['+district_address'],
            imgSrc = legObject.photo_url
        if (addy === undefined) {
            addy = "not listed"
        }
        htmlCards += '<div class="legCard">'
        htmlCards += '<div class="portrait">'
        htmlCards +=    '<img src="' + imgSrc + '">'
        htmlCards += '</div>'
        htmlCards += '<div class="legData">'
        htmlCards +=    '<h2 class="name">name: ' + name + '</h2>'
        htmlCards +=    '<p class="address">address: ' + addy + '</p>'
        htmlCards += '</div>'
        htmlCards += '</div>'
    }
    var rightContainer = document.querySelector('#rightCol')
    console.log(rightContainer)
    rightContainer.innerHTML = htmlCards
}

var searchFunction = function(eventObj){
    // If enter is pressed
    if (eventObj.keyCode === 13){
        //extract value user typed
        var inputElement = eventObj.target
        var inputValue = inputElement.value
        // make a custom query with the input value
        location.hash = "stateSearch/" + inputValue
        inputElement.value = ""

    }
}

var renderHomeView = function() {
    containerNode.innerHTML = "<p>welcome to state stats. enter a 2-letter state code in the search bar to get data on the state as well as a full list of the state's legislators.</p>"    
}


var StatesRouter = Backbone.Router.extend({
    routes: {
        "home": "showHomePage",
        // the colon syntax below tells backbone not to match the actual string "state", but instead to treat WHATEVER it sees after search/ as a variable, and then pass it into doStateSearch.
        "stateSearch/:state": "doStateSearch",
        "legislatorSearch/:party": "doPartySearch",
        "input1/:name/input2/:color/input3/:weight": "logInputs",
        "*default": "redirectToHome"
    },

    redirectToHome: function() {
        location.hash = "home"
    },

    showHomePage: function() {
        renderHomeView()
    },

    doPartySearch: function(party) {
        // these functions are only hypothetical at this point
        getLegislatorsByParty(party).then(partyDataHandler)
    },

    doStateSearch: function(stateCode) {
        containerNode.innerHTML = '<div id="leftCol"></div><div id="rightCol"></div>'
        doStateRequest(stateCode).then(stateDataHandler)
        doLegislatorsRequest(stateCode).then(legislatorDataHandler)
    },

    logInputs: function(theName,theColor,theWeight) {
        console.log('first variable in route>>>',theName)
        console.log('second variable in route>>>',theColor)
        console.log('third variable in route>>>',theWeight)
    }
})

// create a new instance of the router
var rtr = new StatesRouter()

// tell backbone to start watching the hash and tracking browser history
Backbone.history.start()

var searchBar = document.querySelector('input')
searchBar.addEventListener('keydown', searchFunction)

