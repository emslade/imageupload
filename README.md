# No longer maintained

If you're looking for a TinyMCE 4 compatible version, try https://github.com/boxuk/tinymce-imageupload.

A simple image file browser and uploader plugin for TinyMCE. Inserts selected image into the editor. Files and directories to browse are retrieved via an Ajax GET request in JSON format. Created as an alternative to the iBrowser TinyMCE plugin.

Tested in the following browsers: Google Chrome, FF4, FF3, IE6, IE8

Required configuration:

* `imageupload_upload_url` - URL to POST to with files to upload 
* `imageupload_get_url` - URL to retrieve a JSON object of files and folders to browse
* `imageupload_image_dir` - Path to prepend to image path on insertion into the editor
* `imageupload_delete_url` - URL to delete an image. Should only accept POST requests and retrieve the POST parameter `path`

Example JSON from `imageupload_get_url`:

	{"\/":{"dirs":["foo"],"files":["image1.png", "image2.gif"]}, "foo":{"files":["image3.jpg"]}}

This represents:

    /
	|-- foo
	|   `-- image3.jpg
	|-- image1.png
	`-- image2.gif

Example JSON from `imageupload_delete_url`:

    {"success": false, "message": 'File deleted'}

# Installation #

* Create directory `tinymce/plugins/imageupload` and extract contents into here
* Edit dialog.htm and insert correct paths for the various JS files

## Example usage ##

	tinyMCE.init({
        mode : "textareas",
        theme : "advanced",   //(n.b. no trailing comma, this will be critical as you experiment later)
        plugins: "imageupload",
        theme_advanced_buttons3_add : "separator, imageupload",
        relative_urls : true, // Default value
        document_base_url : 'http://www.example.com/',
        imageupload_upload_url : 'http://www.example.com/upload_image',
        imageupload_get_url : 'http://www.example.com/get_uploaded_images',
        imageupload_image_dir : '/images/uploaded',
        imageupload_delete_url : 'http://www.example.com/delete_image'
	});
