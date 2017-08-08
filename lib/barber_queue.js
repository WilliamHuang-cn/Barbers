var fs = require('fs');
var path = require('path');
var serviceList = require('./service_list');
const EventEmitter = require('events');
// var emitter = new EventEmitter();

// TODO: change queue to a JSON obejct. Use openid as key.
// var queue = [{
//     name:'拿破仑·波拿巴',
//     openid:'789$&^bjnk%9nide5O)y6CVI9rv89G+.+?JU',
//     tel:'+1 (970) 565-79789',
//     serviceType:'fine_cut',
//     serviceName:'皇室特供精剪',
//     estimatedTime:90,
//     sex:'男',
//     remark:'朕假发戴惯了，换一个板寸试试'
// }];

var queue = [];

module.exports = exports = new EventEmitter();

function queueUpdated() {
    exports.emit('queueUpdated');
}

// Add a customer to end of queue
exports.addCustomerToQueue = (customer, cb) => {
    var error = checkCustomer(customer);
    if (error) {
        cb(error);
        return;
    }

    customerIndexInQueue(customer, (err,index) => {
        if (err && index == NaN) {
            cb(err);
        }
        if (!err && index != -1) {
            err = new Error('Unable to add customer to queue: '+'WeChat openid already exist');
            cb(err);
        }
        else {
            var outCustomer = normalizedCustomer(customer);
            queue.push(outCustomer);
            exports.emit('queueUpdated',{customer:outCustomer,action:'push'});
            cb(null,outCustomer);
        }
    });
}

// Pops the customer in the front of the queue
exports.nextCustomerFromQueue = (cb) => {
    var err = null;
    var customer = queue.shift() || null;
    if (!customer) err = new Error('Queue depleted.');
    exports.emit('queueUpdated',{customer:customer,action:'pop'});
    cb(err, customer);
}

// Returns customers in queue
exports.queueInfo = (cb) => {
    var err = null;
    var customersInQueue = queue;

    // TODO: replace service type with localized strings

    cb(err,customersInQueue);
}

// TODO: Use serviceList to fetch estimatedTime instead
exports.totalEstimatedTime = (options,cb) => {
    var err = null;
    var totalETime = 0;
    var totalCustomer = 0;
    var count = queue.length;
    var inqueue = false;
    var serviceType = '';
    var remark = '';

    err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }
    var customerID = options.openid;

    if (!customerID) {
        queue.forEach((customer) => {
            totalETime += customer.estimatedTime;
            totalCustomer ++;
        });
    }
    else {
        foundCus = queue.find((customer,index,array) => {
            if (customer.openid != customerID) {
                totalETime += customer.estimatedTime;
                totalCustomer ++;
            }
            return customer.openid === customerID;
        });

        if (foundCus) {
            inqueue = true;
            serviceType = foundCus.serviceType;
            remark = foundCus.remark;
        }
    }
    cb(err,{totalETime,totalCustomer,inqueue,serviceType,remark});
}

exports.numberOfCustomersInQueue = (cb) => {
    var err = null;
    var numberInQueue = 0;
    cb(err,queue.length);
};

// Options should include at least openid of the customer to remove
// TODO: 'return removed customer in callback function'
exports.removeCustomerFromQueue = (options,cb) => {
    var err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }

    customerIndexInQueue(options, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            var element = queue.splice(index,1);
            exports.emit('queueUpdated',{customer:element,action:'remove'});
            cb(err,element);
        }
    });
}

exports.hasCustomer = (options,cb) => {
    var err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }

    customerIndexInQueue(options, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            cb(err,queue[index]);
        }
    });
}

exports.modifyCustomerInQueue = (customer,cb) => {
    var err = null;

    err = checkCustomer(customer);
    if (err) {
        cb(err);
        return;
    }

    customerIndexInQueue(customer, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            queue[index] = normalizedCustomer(customer);
            exports.emit('queueUpdated',{customer:queue[index],action:'modify'});
            cb(err,queue[index]);
        }
    });
}

function moveToQueueHead(options,cb) {
    var err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }

    customerIndexInQueue(options, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            var element = queue[index];
            queue.unshift(queue.splice(index,1));
            exports.emit('queueUpdated',{customer:element,action:'moveToHead'});
            cb(err,element);
        }
    });
}
exports.moveToQueueHead = moveToQueueHead;

function moveToQueueTail (options,cb) {
    var err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }

    customerIndexInQueue(options, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            var element = queue[index];
            queue.push(queue.splice(index,1));
            exports.emit('queueUpdated',{customer:element,action:'moveToTail'});
            cb(err,element);
        }
    });
}
exports.moveToQueueTail = moveToQueueTail;

function moveInQueue(options,delta,cb) {
    var err = checkSearchOption(options);
    if (err) {
        cb(err);
        return;
    }
    customerIndexInQueue(options, (err,index) => {
        if (err) {
            cb(err);
        }
        else {
            if (delta == 0) {
                cb(err,queue[index]);
                return;
            }
            var tailIndex = queue.length - 1;
            var secondIndex = index + delta;
            if (secondIndex < 0) secondIndex = 0;
            if (secondIndex > tailIndex) secondIndex = tailIndex;
            if (secondIndex == 0) {
                moveToQueueHead(options,(err,element) => {
                    cb(err,element);
                });
                return;
            }
            if (secondIndex == tailIndex) {
                moveToQueueTail(options,(err,element) => {
                    cb(err,element);
                });
                return;
            }
            var element = queue.splice(index,1);
            queue.splice(secondIndex-1,0,element);
            exports.emit('queueUpdated',{customer:element,action:'move'});
            cb(err, element)
        }
    });
}
exports.moveInQueue = moveInQueue;

function exchangeTwoEelement(first,second) {
    var hight = queue.length - 1;
    if (first < 0 || second < 0) return false;
    if (first > hight || second > hight) return false;
    if (first == hight) return true;
    var element = queue[first];
    queue[first] = queue[second];
    queue[second] = element;
    exports.emit('queueUpdated',{customer:element,action:'exchanged'});
    return true;
}

function customerIndexInQueue(options,cb) {
    var err = checkSearchOption(options);
    var i;
    if (err) {
        i = NaN;
    }
    else {
        i = queue.findIndex((element,index,array) => {
            return (options.openid === element.openid);
        });
        if (i < 0) err = new Error('No customer found with given identification');
    }
    cb(err,i);
}

function checkSearchOption(options) {
    var err = null;
    if (!options.hasOwnProperty('openid')) {
        err = new Error('No customer identification found in options');
    }
    return err;
}

function checkCustomer(customer) {
    var err = null;
    // Validation checks
    if (!customer.hasOwnProperty('openid') || !customer.hasOwnProperty('serviceType')) {
        err = new Error('Unable to add customer to queue: '+'Insufficient customer info');
        return err;
    }
    if (typeof(customer.openid) != 'string' || customer.openid == '') {
        err = new Error('Unable to add customer to queue: '+'Invalid WeChat openid');
        return err;
    }
    if (typeof(customer.serviceType) != 'string' || !serviceList.isValidService(customer.serviceType)) {
        err = new Error('Unable to add customer to queue: '+'Invalid service type');
        cb(err);
        return err;
    }
    return err;
}

// TODO: normalize input customer. Change to async func later
function normalizedCustomer(customer) {
    var outCustomer = {};
    serviceList.getEstimatedTimeForService(customer.serviceType,(error,time,serviceName) => {
        if (error) console.log(err);
        outCustomer = { name:customer.name,
                openid:customer.openid,
                serviceType:customer.seriveType,
                serviceName:serviceName,
                estimatedTime:time,
                tel:customer.tel,
                sex:customer.sex,
                remark:customer.remark
            }
    });
    while (!outCustomer);
    return outCustomer;
}
