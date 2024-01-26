"use strict";
//design inspired by the cost estimator by Oracle here: https://www.oracle.com/cloud/costestimator.html

let table = document.getElementById("costTbody");
const costData = [];

// Define prices here

//onclick of Submit button
function addRow() {
    // Get values from form
    const item = document.getElementById("formService").value;
    const quantity = document.getElementById("formQuantity").value;
    const price = getPrice(quantity, 150);
    //Establish then use constructor
    const newRow = new ServiceItem(item, quantity, price);
    newRow.insertRow();
}

function getPrice(quantity, itemPrice) {
    return quantity * itemPrice;
}

// Constructor for service items
function ServiceItem(item, quantity, price) {
    this.item = item;
    this.quantity = quantity;
    this.price = price;
    //add items to array
    //costData[this.item, this.quantity, this.price];
    costData.push(this.item);
    costData.push(this.quantity);
    costData.push(this.price);

    //Add new row to table
    this.insertRow = function() {
        
        //table.innerHTML = "<tr><th>Service Name</th><th>Quantity</th><th>Price</th></tr>"
        //table.innerHTML += "<tr><td>" + this.item + "</td>";
        //table.innerHTML += "<td>" + this.quantity + "</td>";
        //table.innerHTML += "<td>" + this.price + "</td></tr>";

        //const tr = document.createElement("tr");
        //const td = document.createElement("td");
        //td.innerHTML = this.item;
        //tr.appendChild(td);
        //td.innerHTML += this.quantity;
        //tr.appendChild(td);
        //td.innerHTML += this.price;
        //tr.appendChild(td);
        //table.appendChild(tr);
        
        //table.innerHTML = "<tr><th>Service Name</th><th>Quantity</th><th>Price</th></tr>";
        table.innerHTML += "<tr><td>" + this.item + "</td><td>" + this.quantity + "</td><td>" + this.price + "</td></tr>";
        //table.innerHTML += "<tr>";
        //for (let data in costData) {
        //    table.innerHTML += "<td>" + costData[data] + "</td>";
        //}
        //table.innerHTML += "</tr>";

        //all of that...just because the form was just being weird...yuck.
    };
}