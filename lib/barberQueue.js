var fs = require('fs');
var path = require('path');

var queue = [];

// Accepted customer structure:
// {
//     nickname:
//     OpenID:     // WeChat OpenID
//     serviceType:
//     estimatedTime:
// }

// Add a customer to end of queue
exports.addCustomerToQueue = (customer, cb) => {
    console.log('Customer '+customer.name+' added to queue!');
};

// Pops the customer in the front of the queue
// Callback receives customer info and error if necessary
exports.nextCustomerFromQueue = (cb) => {
    var err = null;
    var customer = {
        'nickname':'小米',
        'OpenID':'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',     // WeChat OpenID
        'serviceType':'烫发',
        'estimatedTime':50
    }
    cb(err, customer);
};

// Returns customers in queue
exports.queueInfo = (cb) => {
    var err = null;
    var customersInQueue = [];
    cb(err,customersInQueue);
};

exports.totalEstimatedTime = (cb) => {
    var err = null;
    var totalETime = 120;
    cb(err,totalETime);
};

exports.numberOfCustomersInQueue = (cb) => {
    var err = null;
    var numberInQueue = 3;
    cb(err,numberInQueue);
};
