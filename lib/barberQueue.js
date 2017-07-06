var fs = require('fs');
var path = require('path');
var serviceList = require('./serviceList');

var queue = [];

// Accepted customer structure:
// {
//     'nickname':    // Optional
//     'openid':     // WeChat OpenID
//     'serviceType':
//     'estimatedTime':     // Optional
// }

// Add a customer to end of queue
exports.addCustomerToQueue = (customer, cb) => {
    var err = null;
    // console.log('Customer '+customer.nickname+' added to queue for service type: '+customer.serviceType+'!');

    // Validation checks
    if (!customer.hasOwnProperty('openid') || !customer.hasOwnProperty('serviceType')) {
        err = new Error('Unable to add customer to queue: '+'Insufficient customer info');
        cb(err);
        return;
    }
    if (typeof(customer.openid) != 'string' || customer.openid == '') {
        err = new Error('Unable to add customer to queue: '+'Invalid WeChat openID');
        cb(err);
        return;
    }
    if (typeof(customer.serviceType) != 'string' || !serviceList.isValidService(customer.serviceType)) {
        err = new Error('Unable to add customer to queue: '+'Invalid service type');
        cb(err);
        return;
    }

    function checkCustomerID(cus,index,array) {
        return cus.openid == customer.openid;
    }

    if (queue.some(checkCustomerID)) {
        err = new Error('Unable to add customer to queue: '+'WeChat openID already exist');
        cb(err);
        return;
    }

    // Complete customer info if necessary (eg. estimatedTime)
    serviceList.getEstimatedTimeForService(customer.serviceType,(error,time) => {
        if (error != null) console.log(err);
        customer.estimatedTime = time;
        queue.push(customer);
        cb(err);
    });
};

// Pops the customer in the front of the queue
// Callback receives customer info and error if necessary
exports.nextCustomerFromQueue = (cb) => {
    var err = null;
    var customer = queue.shift();
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
                    cb(err,totalETime);
                }
            }
            else {
                cb(err,-1);
            }
        });
    }
};

exports.numberOfCustomersInQueue = (cb) => {
    var err = null;
    var numberInQueue = 3;
    cb(err,numberInQueue);
};
