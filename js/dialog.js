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

        if (ImageUploadDialog.imgsrc) {
            var ed = tinyMCEPopup.editor;
            args = {'src': tinyMCE.activeEditor.getParam('imageupload_image_dir') + ImageUploadDialog.imgsrc};

            ed.execCommand('mceInsertContent', false, '<img id="__mce_tmp" />', {skip_undo : 1});
            ed.dom.setAttribs('__mce_tmp', args);
            ed.dom.setAttrib('__mce_tmp', 'id', '');
            ed.undoManager.add();
        }

        //tinyMCEPopup.close();
    },
    remove : function(path) {
        if (path) {
            if (confirm('Confirm file deletion')) {
                var url = tinyMCE.activeEditor.getParam('imageupload_delete_url');
                var self = this;

                $.ajax({
                    url: url,
                    data: { path: path },
                    type: 'post',
                    success: function(json) {
                        if (!json.success) {
                            alert(json.message);
                            return;
                        }

                        self.loadFiles();
                    }
                });
            }
        }
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
                        o += '<li><a class="dir empty" href="#">' + this.obj[dir].dirs[i] + '</a></li>';
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

        $('a.prev').dblclick(function(e) {
            self.stack.pop();
            self.listContents(self.getPath());
        });

        $('a.file').each(function(key, item) {
            if (self.getPath() == '/') {
                var fullpath = self.getPath() + $(this).text();
            } else {
                var fullpath = self.getPath() + '/' + $(this).text();
            }

            $(item).click(function(e) {
                if (self.sel) $(self.sel).removeClass('selected');
                self.sel = this;
                $(this).addClass('selected'); 

                ImageUploadDialog.imgsrc = fullpath;
            });

            var a;

            $(this).mouseenter(function(e) {
                a = $("<a></a>").attr('href', '#').addClass('delete-item').click(function(e) { self.remove(fullpath) });
                $(this).append(a);
            });

            $(this).mouseleave(function(e) {
                $(a).remove();
            });
        });

        $('a.dir').each(function(key, item) {
            $(this).dblclick(function(e) {
                dir = $(this).text();
                self.stack.push(dir);

                dir = self.getPath();

                if (self.obj[dir]) {
                    self.listContents(dir);
                } else {
                    self.stack.pop()
                }
            });

            var a;

            $(this).mouseenter(function(e) {
                a = $("<a></a>").attr('href', '#').addClass('delete-item').click(function(e) { self.remove(self.getPath() + $(item).text()); });
                $(this).append(a);
            });

            $(this).mouseleave(function(e) {
                $(a).remove();
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
    }
};

tinyMCEPopup.onInit.add(ImageUploadDialog.init, ImageUploadDialog);
