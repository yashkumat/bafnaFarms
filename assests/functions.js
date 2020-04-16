var message = "";
var address = "";
var whatsappTable = "";
var total = [];
var FinalAmount = "";
var lat = "";
var long = "";
var items = [];
var quantity = []
var date = new Date();
var content;
var ItemData = "";
var invoice = "";
var price = [];
var deliveryAvailable = "";
var dist = ""
var billGenerated = false;
var prices = {
    // [price in vambori, price in rahuri, prive in nagar]
    guava: [40, 40, 40, "Farm fresh Alphanso straight from farms"],
    grapes: [40, 40, 50, "Each grape taste sweet and juicy"],
    oranges: [50, 60, 60, "Healthy immune system, Natural skin care"],
    watermelon: [15, 15, 15, "Helps You Hydrate. Sweet and juicy"],
    onion: [20, 20, 20, "Export quality, Best and all type of Onions"],
    muskmelon: [30, 30, 30, "Nutrient Dense, sweet and delicate"]
}


// Materialize initialiZation
$(document).ready(function () {
    $('.slider').slider({ interval: 3000 });
    $('.scrollspy').scrollSpy();
    $('select').formSelect();
    $('.modal').modal();
});

// Set price and variety
function setValues(x) {

    if (between(x, 0, 3)) {
        document.getElementById('guavaPrice').innerHTML = "Rs. " + prices.guava[x] + " Per Kg"
        document.getElementById('grapesPrice').innerHTML = "Rs. " + prices.grapes[x] + " Per Kg"
        document.getElementById('orangePrice').innerHTML = "Rs. " + prices.oranges[x] + " Per Kg"
        document.getElementById('watermelonPrice').innerHTML = "Rs. " + prices.watermelon[x] + " Per Kg"
        document.getElementById('onionPrice').innerHTML = "Rs. " + prices.onion[x] + " Per Kg"
        document.getElementById('muskmelonPrice').innerHTML = "Rs. " + prices.muskmelon[x] + " Per Kg"
        document.getElementById('ProductDetails').innerHTML = "Quantity <i class='material-icons small'>create</i>";
    }
    else {
        document.getElementById('guavaQuantity').style.display = "none"
        document.getElementById('grapesQuantity').style.display = "none"
        document.getElementById('orangesQuantity').style.display = "none"
        document.getElementById('watermelonQuantity').style.display = "none"
        document.getElementById('onionQuantity').style.display = "none"
        document.getElementById('muskmelonQuantity').style.display = "none"
        document.getElementById('guavaPrice').style.display = "none"
        document.getElementById('grapesPrice').style.display = "none"
        document.getElementById('orangePrice').style.display = "none"
        document.getElementById('watermelonPrice').style.display = "none"
        document.getElementById('onionPrice').style.display = "none"
        document.getElementById('muskmelonPrice').style.display = "none"
        document.getElementById('bill').style.display = "none"
        document.getElementById('details').style.display = "none"

    }
}

window.onload = function () {
    document.getElementById('guavaVariety').innerHTML = prices.guava[3]
    document.getElementById('grapeVariety').innerHTML = prices.grapes[3]
    document.getElementById('orangeVariety').innerHTML = prices.oranges[3]
    document.getElementById('watermelonVariety').innerHTML = prices.watermelon[3]
    document.getElementById('onionVariety').innerHTML = prices.onion[3]
    document.getElementById('muskmelonVariety').innerHTML = prices.muskmelon[3]
}

// Get users Address and pass it to show position function
function getAddress() {
    navigator.geolocation.getCurrentPosition(showPosition);
}

// create address link and button which redirects to google maps
function showPosition(position) {

    lat = position.coords.latitude;
    long = position.coords.longitude
    var element = document.getElementById("hideCheck");
    var LocationName = checkRadius(lat, long);
    var showAddressButton = document.getElementById("showAddress");

    if (position.coords.latitude) {
        address = "https://www.google.com/maps/place/" + lat + "," + long;
        if (between(LocationName, 0, 3)) {
            setValues(LocationName);
            element.innerHTML = "<i class='fa fa-check-circle' id='check' aria-hidden='true'></i>";
            showAddressButton.innerHTML = "<a href='" + address + "' class='waves-effect waves-light bPink cBlack btn-small btn-block'><i class='fa fa-map-marker' aria-hidden='true' ></i> Open Maps</a>";
            deliveryAvailable = true;
        } else {
            setValues(LocationName);
            $('#LocationNotSet').modal('open');
            deliveryAvailable = false;
        }
    } else {
        element.innerHTML = "<small>Enter Manually in whatsapp!<small>";
    }
}

// First letter capital
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// get form value stored in out. out is formated to json format in jsonString which is then converted to json object obj.
function allvaluestostring(that) {

    if (deliveryAvailable) {
        var out = "";
        var name = "";
        var address = ""

        $.each($(that).serializeArray(), function (idx, el) {

            if (isNaN(el.value)) {
                if (el.name == "fullname") {
                    name = capitalizeFirstLetter(el.value)
                } else {
                    address = capitalizeFirstLetter(el.value)
                }
            } else {
                el.value == 0
                    ? (out += '\n"' + capitalizeFirstLetter(el.name) + '":"0",')
                    : (out += '\n"' + capitalizeFirstLetter(el.name) + '" : "' + el.value + '",');
            }
        });

        var jsonString = "{" + out.substring(0, out.length - 1) + "}";

        var obj = JSON.parse(jsonString);

        quantity = Object.values(obj);

        items = Object.keys(obj)

        var i = 0;

        for (var key in prices) {
            price[i] = prices[key][0];
            i++
        }

        total = quantity.map(function (val, ind) {
            return val * price[ind];
        });

        FinalAmount = total.reduce((a, b) => a + b, 0);

        ItemData = "";
        for (var i = 0; i < price.length; i++) {
            if (quantity[i] > 0) {
                ItemData += "<tr><td>" + items[i] + "</td>"
                ItemData += "<td>" + quantity[i] + "</td>"
                ItemData += "<td>" + price[i] + "</td>"
                ItemData += "<td>" + total[i] + "</td></tr>"
            }
        }

        if (ItemData == "") {
            content = "<center><h5 class='cYellow center-align'>No Item Selected. Please Enter Quantity!</h5></center>"
        } else {
            content =
                '<div id="receiptData">' +
                '<div>' +
                '<p class="right-align">Contact: +91 9422728489</p>' +
                '</div>' +
                '<div class="invoice-title card-title center-align">Bafna Farm\'s fresh fruits and vegetables</div>' +
                '<p class="center-align">Receipt, Dated : ' + date.toDateString() + '</p>' +
                '<br>' +
                '<small>Customer Details: </small>' +
                '<p> Name: ' + name + '<br>Address: ' + address +
                '</p><br>' +
                '<table class="centered responsive-table striped" id="receipt">' +
                '<thead>' +
                '<th>Item</th>' +
                '<th>Quantity</th>' +
                '<th>Price</th>' +
                '<th>Total</th>' +
                '</thead>' +
                '<tbody>' +
                ItemData +
                '</tbody>' +
                '</table>' +
                '<div class="center-align finalAmount">Final Total - Rs. ' + FinalAmount + '</div>' +
                '</div>';
        }

        invoice =
            '<div class="row">' +
            '<div class="col s8 push-s2">' +
            '<div class="card">' +
            '<div class="card-content">' +
            content +
            '<br>' +
            '<div class="row">' +
            '<div class="col s6 l4 push-l2">' +
            '<a class="btn-small btn-block waves-effect waves-light bDark cBlack" href="#payment">' +
            'Place order</a>' +
            '</div>' +
            '<div class="col s6 l4 push-l2">' +
            '<button class="btn-small btn-block waves-effect waves-light bDark cBlack" onclick="saveReceipt()">' +
            'Save Receipt</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        document.getElementById('invoice').innerHTML = invoice;
        billGenerated = true
    } else {
        billGenerated = false
        billNotGenerated()
    }
};

function billNotGenerated() {
    var toastHTML = '<small>Please input all the fields step by step!</small>';
    M.toast({ html: toastHTML, classes: 'rounded center-align' });
    window.location.href = '#setAddress'
}

// Type if nuber only
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
        document.getElementById("error").style.display = "inline"
        document.getElementById("error").innerHTML = "Enter a positive number! &nbsp; <i class='close material-icons'>close</i>"
        window.location.href = '#onionPrice'
    } else {
        document.getElementById("error").style.display = "none"
    }
}


// send whatsapp message
function whatsapp() {

    if (billGenerated == false) {
        var url = "https://wa.me/+919422728489/?text=Thank%20you%20for%20contacting%3A%20%0ABAFNA%20FARMS%20fresh%20%26%20organic%20fruits%20%26%20vegetable!%0A%0AEnter%20Item%20name%3A%20%0AQuantity%3A%0A%0A%0AWe%20will%20get%20back%20to%20you%20asap!"
        window.open(url);
    } else {
        whatsappTable = "Item - Quantity\n";
        for (var j = 0; j < price.length; j++) {
            if (quantity[j] > 0)
                whatsappTable += items[j] + " - " + quantity[j] + "\n"
        }

        whatsappTable += "\nFinal Amount: " + FinalAmount;

        message = "Thank you for contacting\nBAFNA FARM's fresh fruits and vegetables\n\n\nOrder received:\n" + whatsappTable + "\n\nDeliver to Address - \n" + address + "\n\nWe will get back to you asap!\n\nGo back ->\nhttps://yashkumat.github.io/bafnaFarms/";
        console.log(message);
        var url = 'https://wa.me/+919422728489/?text=' + encodeURIComponent(message);
        window.open(url);
    }

}

// prevent from reloading form
$("#quantity").submit(function (e) {
    e.preventDefault();
});

// save bill
function saveReceipt() {
    var pdf = new jsPDF('p', 'pt', 'letter');

    source = $('#receiptData')[0];

    margins = {
        top: 20,
        left: 20
    };

    pdf.fromHTML(
        source,
        margins.left,
        margins.top,
        {
            "width": "100%"
        },
        function (dispose) {
            pdf.save('Test.pdf');
        }, margins
    );
}

// check if location is set, also check if quantity is positive
function checkIfLocationIsSet(event) {
    if (dist == "") {
        var toastHTML = '<small>Please set your location first!</small>';
        M.toast({ html: toastHTML, classes: 'rounded center-align' });
        window.location.href = '#setAddress'
    }
}



// Hides pulse midway call button on navbar
$(document).ready(function () {
    $(window).scroll(function () {
        $('#callShortcut').toggleClass("hide", ($(window).scrollTop() > 100));
    });
});


// Check radius 
function checkRadius(lat, long) {

    var dist = distance(19.2888432, 74.7230288, lat, long);
    var direction = getDirection(19.2888432, 74.7230288, lat, long);

    if (between(dist, 0, 1)) {
        return 0
    } else if (between(dist, 13, 15) && direction == "NW") {
        return 1
    } else if (between(dist, 21.5, 24) && direction == "NW") {
        return 1
    } else if (between(dist, 15, 27) && direction == "S") {
        return 2
    }
    else {
        return 0
    }
}


function distance(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = deg2rad(lon2 - lon1);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    dist = R * c; // Distance in km
    return dist;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function getDirection(lat1, lon1, lat2, lon2) {
    x1 = lat2;
    y1 = lon2;
    x2 = lat1;
    y2 = lon1;

    var radians = getAtan2((y1 - y2), (x1 - x2));

    function getAtan2(y, x) {
        return Math.atan2(y, x);
    };

    var compassReading = radians * (180 / Math.PI);

    var coordNames = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
    var coordIndex = Math.round(compassReading / 45);
    if (coordIndex < 0) {
        coordIndex = coordIndex + 8
    };

    return coordNames[coordIndex]; // returns the coordinate value
}

// check quantity between 0 and 9
function between(x, min, max) {
    return x >= min && x <= max;
}

$(function () {
    $(".preload").fadeOut(2000, function () {
        $(".content").fadeIn(1000);
    });
});


// function abc(){
//     console.log(distance(19.2888432, 74.7230288, 19.2887573, 74.7264641));
//     console.log(distance(19.2888432, 74.7230288, 19.3943102, 74.6419374));
//     console.log(distance(19.2888432, 74.7230288, 19.4487672, 74.597404));
//     console.log(distance(19.2888432, 74.7230288, 19.1104714, 74.6726324));
//     console.log(getDirection(19.2888432, 74.7230288, 19.2887573, 74.7264641));
//     console.log(getDirection(19.2888432, 74.7230288, 19.3943102, 74.6419374));
//     console.log(getDirection(19.2888432, 74.7230288, 19.4487672, 74.597404));
//     console.log(getDirection(19.2888432, 74.7230288, 19.1104714, 74.6726324));
// }

// function rahuri(){
//     console.log(distance(19.2888432, 74.7230288, 19.3839851, 74.6475175));
//     console.log(distance(19.2888432, 74.7230288, 19.3982843, 74.6420645));
//     console.log(getDirection(19.2888432, 74.7230288, 19.3839851, 74.6475175));
//     console.log(getDirection(19.2888432, 74.7230288, 19.3982843, 74.6420645));
// }

// function factory() {
//     console.log(distance(19.2888432, 74.7230288, 19.4460753, 74.5963616));
//     console.log(distance(19.2888432, 74.7230288, 19.47518,74.6143342));
//     console.log(getDirection(19.2888432, 74.7230288, 19.4460753, 74.5963616));
//     console.log(getDirection(19.2888432, 74.7230288, 19.47518,74.6143342));
// }

// function nagar() {
//     console.log(distance(19.2888432, 74.7230288, 19.1592684,74.6830443));
//     console.log(distance(19.2888432, 74.7230288, 19.0515348,74.7413103));
//     console.log(getDirection(19.2888432, 74.7230288, 19.1592684,74.6830443));
//     console.log(getDirection(19.2888432, 74.7230288, 19.0515348,74.7413103));
// }

// function distance(lon1, lat1, lon2, lat2) {
//     var R = 6371; // Radius of the earth in km
//     // var dLat = (lat2 - lat1).toRad();  // Javascript functions in radians
//     // var dLon = (lon2 - lon1).toRad();
//     // var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     //     Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
//     //     Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     // var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     // var d = R * c; // Distance in km
//     // return d;
//     dlon = lon2 - lon1
//     dlat = lat2 - lat1
//     a = (Math.sin(dlat / 2)) ^ 2 + Math.cos(lat1) * Math.cos(lat2) * (Math.sin(dlon / 2)) ^ 2
//     c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
//     var     distance = R * c
//     return distance
// }

// if (typeof (Number.prototype.toRad) === "undefined") {
//     Number.prototype.toRad = function () {
//         return this * Math.PI / 180;
//     }
// }

// user = {lat: 1, long: 2}

    // console.log(user.lat);
    // console.log(Object.keys(location));
    // console.log(Object.values(location)[1][1]);


// DUMP
// whatsappTable = "Item | Quantity | Price | Total";
    // for(var j=0;j<price.length;j++){
    //     whatsappTable += ""+items[i] + " " + quantity[i] + " " + price[i] + " " + total[i]+""
    // }
    // whatsappTable += "Final Amount: "+FinalAmount;

// function save() {
//     const doc = new jsPDF('p', 'mm');

//     doc.autoTable({
//         html: '#receipt',
//         theme: 'grid',
//         tableWidth: 180,
//         columnStyles: {
//             4: { cellWidth: 'wrap' }
//         },
//     });

//     doc.save('pdf test');
// }


// var address = x.innerHTML.toString().substr(36);

// buildTable(obj, ['name','quantity'], document.getElementById('invoice'))

    // var invoice = 

    //     '<div class="row">'+ 
    //     '<div class="col s12 m6">'+
    //     '<div class="card blue-grey darken-1">'+
    //     '<div class="card-content white-text">'+
    //     '<span class="card-title">Card Title</span>'+
    //     
    //     '</div>'+
    //     '<div class="card-action">'+
    //     '<a href="#">This is a link</a>'+
    //     '<a href="#">This is a link</a>'+
    //     '</div>'+
    //     '</div>'+
    //     '</div>'+
    //     '</div>';


    // document.getElementById('abc').innerHTML = invoice;

    // document.getElementById('invoice').innerHTML = invoice;

    // return obj;

    // window.print();
    // var text = invoice.replace(/(<([^>]+)>)/g, "");
    // var printDoc = new jsPDF();
    // printDoc.fromHTML(text, 10, 10, { 'width': 180 });
    // printDoc.autoPrint();
    // printDoc.output("dataurlnewwindow");
    // var tmp = document.createElement("DIV");
    // tmp.innerHTML = invoice;
    // console.log(tmp.textContent || tmp.innerText || "");
    // var doc = new jsPDF();
    // console.log(doc.fromHTML(invoice, 10, 10));
    // // doc.save('Receipt.pdf');
    // var receipt = invoice.replace(/\'/g, '\\\'').replace(/\"/g, '\\\"');


        // buildTable(labels1, obj, document.getElementById('invoice'));

    // var row = 
    //     Object.keys(obj).forEach(function (key) {
    //         // '<tr>' +
    //         //     '<td>' + key + '</td>' +
    //         //     '<td>' + obj[key] + '</td>' +
    //         // '</tr>'
    //         console.log(key, obj[key])
    //     })

    // var invoice = 

    //     '<div class="row" style="padding-top:50px;">' +
    //     '<div class="col s8 push-s2">' +
    //     '<div class="card">' +
    //     '<div class="card-content">' +
    //     '<span class="card-title center-align">Bafna Farm\'s fresh fruits and vegetables</span>' +
    //     '<table class="centered responsive-table">' +
    //     '<thead>' +
    //     '<tr>' +
    //     '<th>Item</th>' +
    //     '<th>Quantity</th>' +
    //     '<th>Price</th>' +
    //     '<th>total</th>' +
    //     '</tr>' +
    //     '</thead>' +
    //     '<tbody>' +        
    //     row+
    //     '</tbody>' +
    //     '</table>' +
    // '</div>' +
    // '<div class="card-action">' +
    // '<a href="#">This is a link</a>' +
    // '</div>' +
    // '</div>' +
    // '</div>' +
    // '</div>';

    // Object.keys(obj).forEach((element) => {
    //     ItemData += "<li>" Object.keys(element) + obj[element] + "</li>"
    // });
