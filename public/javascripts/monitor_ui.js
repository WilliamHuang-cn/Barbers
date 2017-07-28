var socket = io.connect();

function mediaBoxElement(customer) {

    var nameElement = $('<li class="weui-media-box__info__meta"></li>').text(customer.name || `用户${customer.openid}`);
    var sexElement = $('<li class="weui-media-box__info__meta"></li>').text(customer.sex);
    var telElement = $('<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>').text(customer.tel);

    var orderedListElement = $('<ul class="weui-media-box__info"></ul>').append(nameElement).append(sexElement).append(telElement);
    var pElement = $('<p class="weui-media-box__desc"></p>').text(customer.remark);
    var headerElement = $('<h4 class="weui-media-box__title"></h4>').text(customer.serviceType);

    return $('<div></div>').attr({'class':'weui-media-box weui-media-box_text'}).append(headerElement).append(pElement).append(orderedListElement);
}

function hideActionSheet() {
    $('#iosActionsheet').removeClass('weui-actionsheet_toggle');
    $('#iosMask').fadeOut(200);
}

function showActionSheet() {
    $('#iosActionsheet').addClass('weui-actionsheet_toggle');
    $('#iosMask').fadeIn(200);
}

$(document).ready(function () {
    socket.emit('monitorQueue');

    setInterval(function() {
        // socket.emit('monitorQueue');
    }, 1000);

    socket.on('queueInfo',(queueInfo) => {
        for (let customer of queueInfo) {
            $('#queue_list').append(mediaBoxElement(customer));
        }
        // queueInfo.forEach((customer,index) => {
        //     $('#queue_list').append(mediaBoxElement(customer,index));
        // });
        $('[class="weui-media-box weui-media-box_text"]').on('click',showActionSheet);
    });

	$('#iosMask').on('click', hideActionSheet);
	$('#iosActionsheetCancel').on('click', hideActionSheet);
    
});
