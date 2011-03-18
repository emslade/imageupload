# Installation #

* Edit dialog.htm and insert correct paths for the various JS files

# Example usage #

tinyMCE.init({
        mode : "textareas",
        theme : "advanced",   //(n.b. no trailing comma, this will be critical as you experiment later)
        plugins: "imageupload",
        theme_advanced_buttons3_add : "separator, imageupload",
        relative_urls : true, // Default value
        document_base_url : 'http://www.example.com/',
        imageupload_upload_url : 'http://www.example.com/upload_image',
        imageupload_get_url : 'http://www.example.com/get_uploaded_images',
        imageupload_image_dir : '/images/uploaded'
});
