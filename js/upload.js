function uploadFile() {
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
        
        if (xhr.upload) {
            var fd = new FormData();
            fd.append("userfile", document.getElementById('fileToUpload').files[0]);

            xhr.upload.addEventListener("progress", uploadProgress, false);
            xhr.addEventListener('error', uploadFailed, false);
            xhr.addEventListener('readystatechange', foo, false);
            xhr.addEventListener('load', uploadComplete, false);
            xhr.open('POST', tinyMCE.activeEditor.getParam('imageupload_upload_url'));
            xhr.send(fd);

            function foo(evt) {
                if (xhr.readyState == 4) {
                    console.log(xhr.responseText);

                    obj = jQuery.parseJSON(xhr.responseText);
                    alert(obj.message);
                }
            }
        }
    } else {
        var iframe = $('<iframe></iframe>');
        iframe.attr('id', 'upload_iframe');
        iframe.attr('name', 'upload_iframe');
        iframe.css('display', 'none');
        $('#upload_form').after(iframe);

        iframe.unbind();

        iframe.load(function() {
            var text = $('iframe').contents().find('body').text();
            iframe.remove();
            var obj = jQuery.parseJSON(text);
            alert(obj.message);
        });

        $('#upload_form').attr('target', 'upload_iframe');

        $('#upload_form').submit();
    }

}

function uploadProgress(evt)
{
    //console.log(evt);
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        $('#upload-progress').text(percentComplete.toString() + '%');
        console.log(percentComplete);
    } else {
    }

}

function uploadComplete(evt) {
    $('#upload-progress').text('100%');
}

function uploadFailed(evt) {
    alert('error');
}

function showMessage(message) 
{
}
