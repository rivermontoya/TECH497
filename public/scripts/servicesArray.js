let serviceItems = [
    "Responsive Design", 
    "UI Design", 
    "eCommerce",
    "Layout Design",
    "Hosting Solutions",
    "Testing",
    "Quality Assurance"
];

serviceItems.forEach(addServices);

function addServices(index) {
    const serviceOptionsNode = document.getElementById("serviceOptions"); 
    const divNode = document.createElement('div');
    const spanNode = document.createElement('span');
    var service = document.createTextNode(index);
    spanNode.appendChild(service);
    divNode.appendChild(spanNode);
    serviceOptionsNode.appendChild(divNode);
}