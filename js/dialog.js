tinyMCEPopup.requireLangPack();

var ImageUploadDialog = {
    obj : null,
    stack: [],
    sel: null,
    init : function() {
        this.loadFiles();
        $('iframe').attr('src', tinyMCE.activeEditor.getParam('imageupload_upload_url'));
    },
    insert : function() {
        // Insert the contents from the input into the document
        //tinyMCEPopup.editor.execCommand('mceInsertContent', false, document.forms[0].someval.value);

        var ed = tinyMCEPopup.editor;
        args = {'src': tinyMCE.activeEditor.getParam('imageupload_image_dir') + ImageUploadDialog.imgsrc};

        ed.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo : 1});
        ed.dom.setAttribs('__mce_tmp', args);
        ed.dom.setAttrib('__mce_tmp', 'id', '');
        ed.undoManager.add();

        //tinyMCEPopup.close();
    },
    loadFiles: function() {
        var url = tinyMCE.activeEditor.getParam('imageupload_get_url');
        var self = this;

        $.ajax({
            url: url,
            success: function(json) {
                self.stack = [];
                self.obj = json;
                self.stack.push('/');
                self.listContents('/');

                $('a.refresh-browser').click(function(e) {
                    self.loadFiles();
                    e.preventDefault();
                    e.stopPropagation();
                });

                $('#insert_tab').click(function(e) {
                    self.loadFiles();
                });
            },
            failure: function() {
                alert('Could not retrieve images');
            }
        });
    },
    listContents : function(dir) {
        var self = this;
        self.sel = null;

        $('#browser').html('');

        var o = "";

        if (dir != '/') {
            o += '<li><a class="prev" href="#">..</a></li>';
        }

        if (this.obj[dir]) {
            if (this.obj[dir].dirs) {
                for (var i = 0; i < this.obj[dir].dirs.length; i++) {
                    var d = this.obj[dir].dirs[i];
                    var p = this.getPath();

                    if (p != '/') {
                        p += '/';
                    }

                    if (this.obj[p + d]) {
                        o += '<li><a class="dir" href="#">' + this.obj[dir].dirs[i] + '</a></li>';
                    } else {
                        o += '<li class="empty">' + this.obj[dir].dirs[i] + '</li>';
                    }
                }
            }

            if (this.obj[dir].files) {
                for (var i = 0; i < this.obj[dir].files.length; i++) {
                    o += '<li><a class="file" href="#">' + this.obj[dir].files[i] + '</a></li>';
                }
            }
        }

        $('#browser').html(o);

        $('a.prev').click(function(e) {
            self.stack.pop();
            self.listContents(self.getPath());
        });

        $('a.file').each(function(key, item) {
            $(item).click(function(e) {
                if (self.sel) $(self.sel).removeClass('selected');
                self.sel = this;
                $(this).addClass('selected'); 

                if (self.getPath() == '/') {
                    ImageUploadDialog.imgsrc = self.getPath() + $(self.sel).text();
                } else {
                    ImageUploadDialog.imgsrc = self.getPath() + '/' + $(self.sel).text();
                }
            });
        });

        $('a.dir').each(function(item) {
            $(this).click(function(e) {
                dir = $(this).text();
                self.stack.push(dir);

                dir = self.getPath();

                if (self.obj[dir]) {
                    self.listContents(dir);
                } else {
                    self.stack.pop()
                }
            });
        });
    },
    getPath : function() {
        var dir = "";

        for (var i = 0; i < this.stack.length; i++) {
            dir += this.stack[i];

            if (i > 0 && this.stack.length > 2 && i != this.stack.length-1) {
                dir += '/';
            }
        }

        return dir;
    },
};

tinyMCEPopup.onInit.add(ImageUploadDialog.init, ImageUploadDialog);
