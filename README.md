A simple image file browser plugin for TinyMCE. Inserts selected image into the editor. Files and directories to browse are retrieved via an Ajax GET request in JSON format.

Required configuration:

* `imageupload_upload_url` - URL to load inside the iframe for file uploads
* `imageupload_get_url` - URL to retrieve a JSON object of files and folders to browse
* `imageupload_image_dir` - Path to prepend to image path on insertion into the editor

Example JSON from `imageupload_get_url`:

	{"\/":{"dirs":["foo"],"files":["image1.png", "image2.gif"]}, "foo":{"files":["image3.jpg"]}}

This represents:

    /
	|-- foo
	|   `-- image3.jpg
	|-- image1.png
	`-- image2.gif

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
        imageupload_image_dir : '/images/uploaded'
	});
