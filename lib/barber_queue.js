var fs = require('fs');
var path = require('path');
var serviceList = require('./service_list');

// TODO: change queue to a JSON obejct. Use openid as key.
var queue = [{
    name:'拿破仑·波拿巴',
    openid:'789$&^bjnk%9nide5O)y6CVI9rv89G+.+?JU',
    tel:'+1 (970) 565-79789',
    serviceType:'皇室特供精剪',
    estimatedTime:90,
    sex:'男',
    remark:'朕假发戴惯了，换一个板寸试试'
 }];

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
        err = new Error('Unable to add customer to queue: '+'Invalid WeChat openid');
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
        err = new Error('Unable to add customer to queue: '+'WeChat openid already exist');
        cb(err);
        return;
    }

// TODO: Impelment this in service_list.js
    // Complete customer info if necessary (eg. estimatedTime)
    serviceList.getEstimatedTimeForService(customer.serviceType,(error,time) => {
        if (error != null) console.log(err);
        customer.estimatedTime = time;
        queue.push(customer);
        cb(err,customer);
    });
};

// Pops the customer in the front of the queue
// Callback receives customer info and error if necessary
exports.nextCustomerFromQueue = (cb) => {
    var err = null;
    var customer = queue.shift() || null;
    if (!customer) err = new Error('Queue depleted.');
    cb(err, customer);
};

// Returns customers in queue
exports.queueInfo = (cb) => {
    var err = null;
    var customersInQueue = queue;

    // TODO: replace service type with localized strings

    cb(err,customersInQueue);
};

// TODO: Use serviceList to fetch estimatedTime instead
exports.totalEstimatedTime = (customerID,cb) => {
    var err = null;
    var totalETime = 0;
    var totalCustomer = 0;
    var count = queue.length;
    var inqueue = false;

    function add(customer) {
        totalETime += customer.estimatedTime;
        totalCustomer ++;
    }

    if (!customerID) {
        queue.forEach(add);
    }
    else {
        for (let customer of queue) {
            if (customer.openid === customerID) {
                inqueue = true;
                break;
            }
            add(customer);
        }
    }
    cb(err,{totalETime,totalCustomer,inqueue});
};

exports.numberOfCustomersInQueue = (cb) => {
    var err = null;
    var numberInQueue = 0;
    cb(err,queue.length);
};

// Options should include at least openid of the customer to remove
// TODO: 'return removed customer in callback function'
exports.removeCustomerFromQueue = (options,cb) => {
    var err = null;
    if (!options.hasOwnProperty('openid')) {
        err = new Error('No customer identification found in options');
        cb(err);
        return;
    }

    var cusIndex = NaN;
    function scan(element,index,array) {
        if (options.openid == element.openid) {
            cusIndex = index;
        }
        return true;
    };
    queue.every(scan);
    if (cusIndex == NaN) {
        err = new Error('No customer found in queue with identification');
        cb(err);
        return;
    }

    queue.splice(cusIndex,1);
    cb(err);
}

exports.hasCustomer = (options,cb) => {
    var err = null;
    if (!options.hasOwnProperty('openid')) {
        err = new Error('No customer identification found in options');
        cb(err,false);
        return;
    }

    tempCus = null;
    function scan(element,index,array) {
        if (options.openid == element.openid) {
            tempCus = element;
            return true;
        }
        return false;
    };

    if (!queue.some(scan)) err = new Error('No customer found with given identification');
    cb(err,tempCus);
}
