var socket = io.connect();

function mediaBoxElement(customer,index) {

    var nameElement = $('<li class="weui-media-box__info__meta"></li>').text(customer.name || `用户${customer.openid}`);
    var sexElement = $('<li class="weui-media-box__info__meta"></li>').text(customer.sex);
    var telElement = $('<li class="weui-media-box__info__meta weui-media-box__info__meta_extra"></li>').text(customer.tel);

    var orderedListElement = $('<ul class="weui-media-box__info"></ul>').append(nameElement).append(sexElement).append(telElement);
    var pElement = $('<p class="weui-media-box__desc"></p>').text(customer.remark);
    var headerElement = $('<h4 class="weui-media-box__title"></h4>').text(customer.serviceName);

    return $('<div></div>').attr({'class':'weui-media-box weui-media-box_text','index':index,'openid':customer.openid}).append(headerElement).append(pElement).append(orderedListElement);
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
    var chosenCus = '';
    socket.emit('monitorQueue');

    socket.on('queueInfo',(queueInfo) => {
        $('#queue_list').html('');
        queueInfo.forEach((customer,index) => {
            $('#queue_list').append(mediaBoxElement(customer,index));
            $(`[index=${index}]`).on('click',() => {
                chosenCus = $(`[index=${index}]`).attr('openid');
                showActionSheet();
            });
        });
    });

    socket.on('operationResult',(result) => {
        if (result.success) {
            switch (result.action) {
                case 'remove':
                    alert('Successfully remove customer');
                    break;
                case 'moveInQueue':
                    alert('Successfully moved customer in queue');
                    break;
                default:
            }
        } else {
            alert(result.msg);
        }
        socket.emit('monitorQueue');
    });

    socket.on('updateQueue',() => {
        socket.emit('monitorQueue')
    });

	$('#iosMask').on('click', hideActionSheet);
	$('#iosActionsheetCancel').on('click', hideActionSheet);

    $('#delete').on('click',() => {
        hideActionSheet();
        socket.emit('removeCustomer',{openid:chosenCus});
    });

    $('#move_up').on('click',() => {
        hideActionSheet();
        socket.emit('moveCustomerInQueue',{openid:chosenCus,delta:-1});
    });

    $('#move_down').on('click',() => {
        hideActionSheet();
        socket.emit('moveCustomerInQueue',{openid:chosenCus,delta:1});
    });

    $('#modify').on('click',() => {
        hideActionSheet();
        window.location.href = `./register?monitoring=yes&openid=${chosenCus}`
    });
});
