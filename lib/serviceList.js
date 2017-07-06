var services = {
    'cut':{
        'localization':{
            'zh_CN':'单剪',
            'en':'Cut Only',
        },
        'estimatedTime':20,
        'price':30
    },
    'fine_cut':{
        'localization':{
            'zh_CN':'精剪',
            'en':'Fine Cut',
        },
        'estimatedTime':40,
        'price':80
    },
    'blow_dry':{
        'localization':{
            'zh_CN':'吹干',
            'en':'Blow Dry',
        },
        'estimatedTime':15,
        'price':30
    },
    'wash':{
        'localization':{
            'zh_CN':'单洗',
            'en':'Wash Only',
        },
        'estimatedTime':15,
        'price':30
    },
    'eyebrow':{
        'localization':{
            'zh_CN':'修眉',
            'en':'Eyebrow',
        },
        'estimatedTime':40,
        'price':30
    },
    'baked_colour':{
        'localization':{
            'zh_CN':'彩焗',
            'en':'Baked Colour',
        },
        'estimatedTime':40,
        'price':30
    },
    'perm':{
        'localization':{
            'zh_CN':'烫发',
            'en':'Perm',
        },
        'estimatedTime':120,
        'price':30
    }
};

const serviceFilePath = './service.json';

function readServicesFromFile() {

}

exports.priceSummary = (cb) => {
    var err = null;
    var output = services.toString();
    // cb(err,'精剪：80-120元\n洗吹：40-60元\n洗剪吹：60-80元\n单剪：30-60元\n修眉：20元\n彩焗：280-880元\n烫发：380-880元\n修面：40-60元\n护理：120-280元');
    cb(err,output);
};

exports.getEstimatedTimeForService = (service,cb) => {
    var err = null;
    if (services == undefined || services == null) {
        err = new Error('Services unavaliable.');
        cb(err,null);
    }
    if (services.hasOwnProperty(service)) {
        cb(err,services[service].estimatedTime);
    }
    else {
        err = new Error('Service \''+service+'\' not found');
        cb(err,null);
    }
}

exports.isValidService = (service) => {
    var result = false;
    if (services.hasOwnProperty(service)) {
        result = true;
    }
    return result;
}
