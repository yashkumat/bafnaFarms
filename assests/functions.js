var showAddressButton = document.getElementById("showAddress");
var message = "";
var address = "";
var whatsappTable = "";
var total = [];
var FinalAmount = "";
var prices = {
    // [price in vambori, price in rahuri, prive in nagar]
    mango: [50, 60, 70, "Farm fresh Alphanso straight from farms"],
    grapes: [60, 70, 80, "Each grape taste sweet and juicy"],
    oranges: [70, 90, 100, "Healthy immune system, Natural skin care"],
    watermelon: [80, 20, 40, "Helps You Hydrate. Sweet and juicy"],
    onion: [90, 60, 50, "Export quality, Best and all type of Onions"],
    muskmelon: [100, 100, 30, "Nutrient Dense, sweet and delicate"]
}
var items = [];
var quantity = []
var date = new Date();
var content;
var ItemData = "";
var invoice = "";
var price = [];
var d = "";

// Materialize initialiZation
$(document).ready(function () {
    $('.slider').slider({ interval: 3000 });
    $('.scrollspy').scrollSpy();
    $('select').formSelect();
});

//  Get location
function getLocation() {
    d = document.getElementById("location").value;
    if (d == "vambori") {
        setValues(0)
    } else if (d == 'rahuri') {
        setValues(1)
    } else {
        setValues(2)
    }
}

// Set price and variety
function setValues(x) {
    document.getElementById('mangoPrice').innerHTML = prices.mango[x]
    document.getElementById('grapesPrice').innerHTML = prices.grapes[x]
    document.getElementById('orangePrice').innerHTML = prices.oranges[x]
    document.getElementById('watermelonPrice').innerHTML = prices.watermelon[x]
    document.getElementById('onionPrice').innerHTML = prices.onion[x]
    document.getElementById('muskmelonPrice').innerHTML = prices.muskmelon[x]
}

window.onload = function () {
    document.getElementById('mangoVariety').innerHTML = prices.mango[3]
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

    var element = document.getElementById("hideCheck");

    if (position.coords.latitude) {
        address = "https://www.google.com/maps/place/" + position.coords.latitude + "," + position.coords.longitude;
        element.innerHTML = "<i class='fa fa-check-circle whiteColor2' id='check' aria-hidden='true'></i>";
        showAddressButton.innerHTML = "<a href='" + address + "' class='waves-effect waves-light blackBack whiteColor2 btn-small btn-block'><i class='fa fa-map-marker' aria-hidden='true' ></i> Open Maps</a>";
    } else {
        element.innerHTML = "<small>Enter Manually in whatsapp!<small>";
    }
}


// get form value stored in out. out is formated to json format in jsonString which is then converted to json object obj.
function allvaluestostring(that) {

    if (address != "" && d != "") {
        var out = "";

        $.each($(that).serializeArray(), function (idx, el) {
            el.value == 0 ? (out += "\n\"" + el.name + "\":\"0\",") : (out += "\n\"" + el.name + '\" : \"' + el.value + "\",");
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
            content = "<h5>No Item Selected. Please Enter Quantity!</h5>"
        } else {
            content =
                '<div id="receiptData">' +
                '<div>' +
                '<p class="right-align">Contact: +91 9422728489</p>' +
                '</div>' +
                '<div class="invoice-title card-title center-align">Bafna Farm\'s fresh fruits and vegetables</div>' +
                '<p class="center-align">Receipt, Dated : ' + date.toDateString() + '</p>' +
                '<br>' +
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
            '<div class="col s6 l3 push-l3">' +
            '<a class="btn-small btn-block waves-effect waves-light bGreen cBlack" href="#payment">' +
            '<i class="material-icons right">add_shopping_cart</i>Place order</a>' +
            '</div>' +
            '<div class="col s6 l3 push-l3">' +
            '<button class="btn-small btn-block waves-effect waves-light bGreen cBlack" onclick="saveReceipt()">' +
            '<i class="material-icons right" >save_alt</i>Save Receipt</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        document.getElementById('invoice').innerHTML = invoice;
    } else {
        var toastHTML = '<small>Please set address or refresh</small><a class="btn-flat toast-action" href="#setAddress">Click here</a>';
        M.toast({ html: toastHTML, classes: 'rounded' });
    }

};

// Type if nuber only
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}


// send whatsapp message
function whatsapp() {

    if (address == "" || d == "" || ItemData == "") {
        var toastHTML = '<small>Please provide above information or call or Refresh!</small><a class="btn-flat toast-action" href="#setLocation">Click here</a>';
        M.toast({ html: toastHTML, classes: 'rounded' });
    }else {
        whatsappTable = "Item - Quantity\n";
        for (var j = 0; j < price.length; j++) {
            if (quantity[j] > 0)
                whatsappTable += items[j] + " - " + quantity[j] + "\n"
        }

        whatsappTable += "\nFinal Amount: " + FinalAmount;

        message = "Thank you for contacting\nBAFNA FARM's fresh fruits and vegetables\n\n\nOrder received:" + whatsappTable + "\n\nDeliver to Address - \n" + address + "\n\nWe will get back to you asap!\n\nGo back ->\nhttps://yashkumat.github.io/bafnaFarms/";
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
        left: 20,
    };

    pdf.fromHTML(
        source,
        margins.left,
        margins.top, {
        'width': margins.width,
    },

        function (dispose) {

            pdf.save('Test.pdf');
        }, margins
    );
}

// check quantity between 0 and 9
function between(x, min, max) {
    return x >= min && x <= max;
}

// check if location is set, also check if quantity is positive
function checkIfLocationIsSet(event) {
    if (d == "") {
        var toastHTML = '<small>Please set location</small><a class="btn-flat toast-action" href="#setLocation">Click here</a>';
        M.toast({ html: toastHTML, classes: 'rounded' });
    } else if (!between(event.keyCode, 47, 58)) {
        var toastHTML = '<small>Enter positive quantity in numbers!</small><a class="btn-flat toast-action href="#setQuantity" ">Undo</a>';
        M.toast({ html: toastHTML, classes: 'rounded' });
    }
}

// Hides pulse midway call button on navbar
$(document).ready(function () {
    $(window).scroll(function () {
        $('#callShortcut').toggleClass("hide", ($(window).scrollTop() > 100));
    });
});









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
