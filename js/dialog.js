tinyMCEPopup.requireLangPack();

var ImageUploadDialog = {
    obj : null,
    stack: [],
    sel: null,
    fileinfo : null,
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
                self.obj = json.listing;
                self.fileinfo = json.info;
                self.stack.push('/');
                self.listContents('/');

                $('a.refresh-browser').click(function(e) {
                    self.loadFiles();
                    e.preventDefault();
                    e.stopPropagation();
                    self.clearPreview();
                });

                $('#insert_tab').click(function(e) {
                    self.loadFiles();
                    self.clearPreview();
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
                
                self.preview(fullpath, $(this).text());
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
            if (self.getPath() == '/') {
                var fullpath = self.getPath() + $(this).text();
            } else {
                var fullpath = self.getPath() + '/' + $(this).text();
            }

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
                a = $("<a></a>").attr('href', '#').addClass('delete-item').click(function(e) { self.remove(fullpath); });
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
    },
    preview : function(path, filename) {
        var url = tinyMCE.activeEditor.getParam('imageupload_preview_url');
        var param = jQuery.param({image: path});
        var preview_url = url + '?' + param;
        var self = this;

        $('#preview div').html($('<img>').attr('src', preview_url));
        
        if (filename.length > 20) {
            filename = filename.substr(0,10) + '...' + filename.substr(filename.length - 10, filename.length);
        }

        $('#preview ul').html($('<li></li>').text(filename));

        if (this.fileinfo[path]) {
            var size = this.fileinfo[path].size;
            
            if (size < 1024) {
                size = size + ' bytes'; 
            } else {
                size = Math.round(this.fileinfo[path].size / 1024) + ' kB';
            }

            $('#preview ul').append($('<li></li>').text(size)); 
            $('#preview ul').append($('<li></li>').text(this.fileinfo[path].width + 'x' + this.fileinfo[path].height)); 

            if ($('#insert-image').length == 0) {
                $('#preview ul').after($('<a></a>').attr('href', '#').attr('id', 'insert-image').text('Insert'));
                $('#preview a#insert-image').click(function() { self.insert(); });
            }

            if ($('#delete-image').length == 0) {
                $('#preview a#insert-image').after($('<a></a>').attr('href', '#').attr('id', 'delete-image').text('Delete'));
                $('#preview a#delete-image').click(function() { alert('DELETE'); });
            }
        }
    },
    clearPreview : function() {
        $('#preview div').html('');
        $('#preview ul').html('');
        $('#insert-image').remove();
        $('#delete-image').remove();
    }
};

tinyMCEPopup.onInit.add(ImageUploadDialog.init, ImageUploadDialog);
