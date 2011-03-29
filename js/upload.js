function uploadFile() {
    var fd = new FormData();
    fd.append("userfile", document.getElementById('fileToUpload').files[0]);

    //console.log(fd);
    
    var xhr = new XMLHttpRequest();
    xhr.upload.addEventListener("progress", uploadProgress, false);
    xhr.addEventListener('error', uploadFailed, false);
    xhr.addEventListener('readystatechange', foo, false);
    xhr.open('POST', tinyMCE.activeEditor.getParam('imageupload_upload_url'));
    xhr.send(fd);

    function foo(evt) {
        if (xhr.readyState == 4) {
            console.log(xhr.responseText);
        }
    }
}

function uploadProgress(evt)
{
    //console.log(evt);
    if (evt.lengthComputable) {
        var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        $('#upload-progress').text(percentComplete.toString());
        console.log(percentComplete);
    } else {
    }

}

function uploadComplete(evt) {
    //console.log(evt);
}

function uploadFailed(evt) {
    alert('error');
}
