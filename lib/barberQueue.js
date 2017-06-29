var fs = require('fs');
var path = require('path');
var serviceList = require('./serviceList');

var queue = [];

// Accepted customer structure:
// {
//     'nickname':    // If possible
//     'openID':     // WeChat OpenID
//     'serviceType':
//     'estimatedTime':
// }

// Add a customer to end of queue
exports.addCustomerToQueue = (customer, cb) => {
    var err = null;
    console.log('Customer '+customer.nickname+' added to queue for service type: '+customer.serviceType+'!');

    // Complete customer info if necessary (eg. estimatedTime)
    if (!customer.hasOwnProperty(estimatedTime)) {
        serviceList.getEstimatedTimeForService(customer.serviceType,(error,time) => {
            if (error != null) console.log(err);
            customer[estimatedTime] = time;
        });
    }
    queue.push(customer);
    cb(err);
};

// Pops the customer in the front of the queue
// Callback receives customer info and error if necessary
exports.nextCustomerFromQueue = (cb) => {
    var err = null;
    var customer = {
        'nickname':'小米',
        'OpenID':'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',     // WeChat OpenID
        'serviceType':'烫发',
        'estimatedTime':120
    }
    customer = queue.shift();
    if (customer == undefined) err = new Error('Queue depleted.');
    cb(err, customer);
};

// Returns customers in queue
exports.queueInfo = (cb) => {
    var err = null;
    var customersInQueue = queue;
    cb(err,customersInQueue);
};

exports.totalEstimatedTime = (cb) => {
    var err = null;
    var totalETime = 120;
    var count = queue.length;
    for (var customer in queue) {
        serviceList.getEstimatedTimeForService(customer.serviceType,(error,time) => {
            if (error != null || time != undefined) {
                totalETime += time;
                --count;
                if (count == 0) {
                    
                }
            }
        });
    }
    cb(err,totalETime);
};

exports.numberOfCustomersInQueue = (cb) => {
    var err = null;
    var numberInQueue = 3;
    cb(err,numberInQueue);
};
