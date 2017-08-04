var queue = require('../lib/barber_queue');

const customer1 = {
    'openid':'adsfasfaecqwefqecqwedsf-2',
    'serviceType':'wash_blow',
    'estimatedTime':15
};
const customer2 = {
    'openid':'asd-23rdf3',
    'serviceType':'wash_blow',
    'estimatedTime':15
};
const customer3 = {
    'openid':'adsfasfaecdwedsf-23rdf3',
    'serviceType':'perm',
    'estimatedTime':120
};

var error = null;
var customer;
do {
    queue.nextCustomerFromQueue((err,cus) =>{
        error = err;
        customer = cus;
    });
} while (!error && customer);

exports.queue_add_success_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue(customer1,(err) => {
        test.equal(err,null,'Adding to queue should not throw error.');
        queue.nextCustomerFromQueue((err,nextCust)=>{
        });
        test.done();
    });
}

// Insufficient service type
exports.queue_add_insufficient_type_fail_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue({
        'openid':'adsfasfaecqwefqecqwedsf-23rdf3',
    },(err) => {
        // TODO: 'Check err message'
        test.throws(() => {throw err},'Adding to queue should throw error on insufficient customer info.');
        test.done();
    });
}

// Insufficient openid
exports.queue_add_insufficient_id_fail_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue({
        'serviceType':'wash'
    },(err) => {
        // TODO: 'Check err message
        test.throws(() => {throw err},'Adding to queue should throw error on insufficient customer info.');
        test.done();
    });
}

// Empty openid
exports.queue_add_invalid_id_fail_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue({
        'openid':'',
        'serviceType':'wash'
    },(err) => {
        // TODO: 'Check err message
        test.throws(() => {throw err},'Adding to queue should throw error on invalid WeChat openid.');
        test.done();
    });
}

// Wrong openid type
exports.queue_add_invalid_id_number_fail_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue({
        'openid':234512345,
        'serviceType':'wash'
    },(err) => {
        // TODO: 'Check err message
        test.throws(() => {throw err},'Adding to queue should throw error on invalid WeChat openid.');
        test.done();
    });
}

// Invalid service type
exports.queue_add_empty_service_tyep_fail_test = function (test) {
    queue.addCustomerToQueue({
        'openid':'adsfasfaecqwefqecqwedsf-23rdf3',
        'serviceType':'qwceb'
    },(err) => {
        // TODO: 'Check err message
        test.throws(() => {throw err},'Adding to queue should throw error on empty service type.');
        test.done();
    });
}

// Wrong serviceType type
exports.queue_add_invalid_id_number_fail_test = function (test) {
    test.expect(1);
    queue.addCustomerToQueue({
        // TODO: 'Check err message
        'openid':'adsfasfaecqwefqecqwedsf-23rdf3',
        'serviceType':235245
    },(err) => {
        // TODO: 'Check err message
        test.throws(() => {throw err},'Adding to queue should throw error on invalid service type.');
        test.done();
    });
}

exports.queue_add_repeat_id_fail_test = function (test) {
    test.expect(2);
    queue.addCustomerToQueue(customer1,(err) => {
        test.doesNotThrow(() => {throw err},'Adding to queue should NOT throw error.');
    });
    queue.addCustomerToQueue(customer1,(err) => {
        // TODO: 'Check err message'
        test.throws(() => {throw err},'Adding to queue should throw error on repeated id.');
        queue.nextCustomerFromQueue((err,nextCust)=>{
            test.done();
        });
    });
}

exports.queue_pop_success_test = function (test) {
    test.expect(7);

    queue.addCustomerToQueue(customer1,(err) => {});
    queue.addCustomerToQueue(customer2,(err) => {});
    queue.addCustomerToQueue(customer3,(err) => {});

    queue.totalEstimatedTime((err,totalInfo) => {
        test.equal(totalInfo.totalETime,180,'Total estimated time should equal to 150.');
    });

    var count = 3;
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        test.equal(customer1,nextCust,'Queue should remove customer 1.');
        if (--count == 0) {
            test.done();
        }
    });
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        test.equal(customer2,nextCust,'Queue should remove customer 2.');
        if (--count == 0) {
            test.done();
        }
    });
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        test.equal(customer3,nextCust,'Queue should remove customer 3.');
        if (--count == 0) {
            test.done();
        }
    });
}

exports.queue_remove_fail_test = function (test) {
    test.expect(1);
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.throws(()=>{throw err},'Queue should throw upon queue depletion.');
        test.done();
    });
}

exports.queue_remove_success_test = function (test) {
    test.expect(5);

    queue.addCustomerToQueue(customer1,(err) => {});
    queue.addCustomerToQueue(customer2,(err) => {});
    queue.addCustomerToQueue(customer3,(err) => {});

    var count = 3;
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        test.equal(customer1,nextCust,'Queue should remove customer 1.');
        if (--count == 0) {
            test.done();
        }
    });
    queue.removeCustomerFromQueue({'openid':'adsfasfaecdwedsf-23rdf3'},(err) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        // test.equal(customer3,nextCust,'Queue should remove customer 3.');
        if (--count == 0) {
            test.done();
        }
    });
    queue.nextCustomerFromQueue((err,nextCust) => {
        test.equal(err,null,'Queue should not throw error upon removing customer.');
        test.equal(customer2,nextCust,'Queue should remove customer 2.');
        if (--count == 0) {
            test.done();
        }
    });
}
