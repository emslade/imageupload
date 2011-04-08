function uploadFile() {
    var xhr_upload = false;

    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
        
        if (xhr.upload) {
            xhr_upload = true;
        }
    }

    if (xhr_upload) {
        var fd = new FormData();
        fd.append("userfile", document.getElementById('fileToUpload').files[0]);

        function foo(evt) {
            if (xhr.readyState == 4) {
                obj = jQuery.parseJSON(xhr.responseText);
                showMessage(obj.message, obj.success);
            }
        }

        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener('error', uploadFailed, false);
        xhr.addEventListener('readystatechange', foo, false);
        xhr.addEventListener('load', uploadComplete, false);
        xhr.open('POST', tinyMCE.activeEditor.getParam('imageupload_upload_url'));
        xhr.send(fd);
    } else {
        var iframe = $('<iframe name="upload_iframe"></iframe>');
        iframe.attr('id', 'upload_iframe');
        iframe.css('display', 'none');
        $('#upload_form').after(iframe);

        iframe.unbind();

        iframe.load(function() {
            var text = $('iframe').contents().find('body').text();
            iframe.remove();
            var obj = jQuery.parseJSON(text);
            showMessage(obj.message, obj.success);
        });

        $('#upload_form').attr('target', 'upload_iframe');

        $('#upload_form').submit();
    }

}

function uploadProgress(evt)
{
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        $('#upload-progress').text(percentComplete.toString() + '%');
    } else {
    }

}

function uploadComplete(evt) {
    $('#upload-progress').text('100%');
}

function uploadFailed(evt) {
    showMessage('error', true);
}

function showMessage(message, error) 
{
    if (!error) {
        $('#upload_message').addClass('fail');
        $('#upload_message').removeClass('success');
    } else {
        $('#upload_message').addClass('success');
        $('#upload_message').removeClass('fail');
    }

    $('#upload_message').text(message);
}
