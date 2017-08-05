var services = {
    fine_cut:{
        localization:{
            zh_CN:"精剪",
            en:"Fine Cut"
        },
        estimatedTime:40,
        price:80,
        pricel:80,
        priceh:120,
        key:"jj"
    },
    wash_blow:{
        localization:{
            zh_CN:"洗吹",
            en:"Wash and blow dry"
        },
        estimatedTime:30,
        price:40,
        pricel:40,
        priceh:60,
        key:"xc"
    },
    cut:{
        localization:{
            zh_CN:"单剪",
            en:"Cut Only"
        },
        estimatedTime:20,
        price:30,
        pricel:30,
        priceh:60,
        key:"dj"
    },
    wash_cut_blow:{
        localization:{
            zh_CN:"洗剪吹",
            en:"Wash, cut, and blow dry"
        },
        estimatedTime:60,
        price:70,
        pricel:60,
        priceh:80,
        key:"xjc"
    },
    shave:{
        localization:{
            zh_CN:"修面",
            en:"Shave"
        },
        estimatedTime:15,
        price:40,
        pricel:40,
        priceh:60,
        key:"xm"
    },
    baked_colour:{
        localization:{
            zh_CN:"彩焗",
            en:"Baked Colour"
        },
        estimatedTime:40,
        price:30,
        pricel:280,
        priceh:880,
        key:"cj"
    },
    perm:{
        localization:{
            zh_CN:"烫发",
            en:"Perm"
        },
        estimatedTime:120,
        price:30,
        pricel:380,
        priceh:880,
        key:"tf"
    },
    nursing:{
        localization:{
            zh_CN:"护理",
            en:"Nursing"
        },
        estimatedTime:50,
        price:34,
        pricel:120,
        priceh:280,
        key:"hl"
    },
    eyebrow:{
        localization:{
            zh_CN:"修眉",
            en:"Eyebrow"
        },
        estimatedTime:40,
        price:20,
        pricel:20,
        priceh:20,
        key:"xmm"
    }
};

var CurrencyUnit = {
    zh_CN:"元",
    en:'yuan'
};

var PersonUnit = {
    zh_CN:"人",
    en:"people"
};

var TimeUnit = {
    zh_CN:"分钟",
    en:"minute"
};

var defaultLocalization = 'zh_CN';

const serviceFilePath = './service.json';

// TODO: implement currency exchange rate.
function changeToCurrency(currency) {
    throw new Error('Function not implemented');
    return;
}

function getCurrencyUnit(localization=defaultLocalization) {
    if (localization && CurrencyUnit.hasOwnProperty(localization)) {
        return CurrencyUnit[localization];
    }
    else {
        // return CurrencyUnit[defaultLocalization];
        return null;
    }
}

function getPersonUnit(localization = defaultLocalization) {
    if (PersonUnit.hasOwnProperty(localization)) {
        return PersonUnit[localization];
    }
    else {
        return PersonUnit[defaultLocalization];
    }
}

function getTimeUnit(localization = defaultLocalization) {
    if (TimeUnit.hasOwnProperty(localization)) {
        return TimeUnit[localization];
    }
    else {
        return TimeUnit[defaultLocalization];
    }
}

getServiceName = (service,localization = defaultLocalization) => {
    var err = null;
    if (service == undefined || service == null) {
        // Services unavaliable
        return null;
    }
    if (services.hasOwnProperty(service)) {
        var serviceInfo = services[service].localization;
        var serviceName = '';
        if (serviceInfo.hasOwnProperty(localization)) {
            serviceName = serviceInfo[localization];
        }
        else {
            serviceName = serviceInfo[defaultLocalization];
        }
        return serviceName;
    }
    else {
        // Service not found
        return null;
    }
}
exports.getServiceName = getServiceName;

function readServicesFromFile() {

}

getServiceList = (localization) => {
    var price = '';
    var prices = '';
    var serviceName = '';
    var serviceType = '';
    var key = '';
    var serviceList = [];
    for (var prop in services) {
        if (services.hasOwnProperty(prop)) {
            serviceType = prop;
            serviceName = getServiceName(prop,localization);
            if (serviceName == undefined || serviceName == null) continue;
            if (services[prop].pricel == services[prop].priceh) {
                price = services[prop].pricel;
            }
            else {
                price = services[prop].pricel + '-' + services[prop].priceh;
            }
            price = price + getCurrencyUnit(localization);
            estimatedTime = services[prop].estimatedTime + getTimeUnit(localization)
            key = services[prop].key;
            serviceList.push({serviceType,serviceName,price,estimatedTime,key});
        }
    }
    return serviceList;
}

exports.getServiceList = getServiceList;
exports.getServiceListSecRef = (localization = defaultLocalization) => {
    var secondary = {}
    var ref = {}
    var serviceList = getServiceList(localization);
    serviceList.forEach((value,index) => {
        secondary[value.key] = value.serviceName;
        ref[value.key] = value.serviceType;
    });
    return {serviceList,secondary,ref};
}

exports.priceSummary = (cb) => {
    var err = null;
    var price = '';
    var prices = '';
    var serviceName = '';
    var serviceList = getServiceList(defaultLocalization);

    for (var i = 0, len = serviceList.length; i < len; i ++) {
        serviceName = serviceList[i].serviceName;
        price = serviceList[i].price;
        price = serviceName + '：' + price;
        if (i == 0) {
            prices = price;
        }
        else {
            prices = prices + '\n' + price;
        }
    }
    cb(err,prices);
};

exports.getEstimatedTimeForService = (service,cb) => {
    var err = null;
    if (services == undefined || services == null) {
        err = new Error('Services unavaliable.');
        cb(err,null,null);
    }
    if (services.hasOwnProperty(service)) {
        cb(err,services[service].estimatedTime,getServiceName(service));
    }
    else {
        err = new Error('Service \''+service+'\' not found');
        cb(err,null,null);
    }
}

exports.isValidService = (service) => {
    var result = false;
    if (services.hasOwnProperty(service)) {
        result = true;
    }
    return result;
}
