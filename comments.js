/*

Title: ScribbleLive Comment Script
Description: This script allows users to leave comments on any page that using the scribble api. An event must be dedicated to contain user comments.

*/
function commentEngine(opts) {
	
	var defaults = {
	    apiEndPoint: "http://apiv1.scribblelive.com",
	    avatar: ""
	};	
	
    var that = this;
    this.opts = $.extend({}, defaults, opts);

    // attach comment click listener
    $(this.opts.idSubmit).click(function () {
        that.sendComment();
    });

    // attach avatar remove click
    $(this.opts.aviRmv).click(function () {
        $('.previewAvi').remove();
        $(that.opts.idAvi).val('');
        $(that.opts.aviRmv).hide();
        that.opts.avatar = "";
    });

    // attach img remove click
    $(this.opts.previewRmv).click(function () {
        $(that.opts.previewClass).remove();
        $(that.opts.idImg).val('');
        $(that.opts.previewRmv).hide();
    });

    // attach avatar file image listener
    $(this.opts.idAvi).change(function (evt) {
        var files = evt.target.files;
        
        // check if there was a file that was selected
        if (files.length == 0) {
            return;
        }

        var f = files[0];

        // check to make sure image type
        if (!f.type.match('image.*')) {
            alert("Not an image! Please try again.");
            return;
        }

        // upload to scribble servers
        var avidata = new FormData();
        avidata.append('file', f);
        $.ajax({
            url: that.opts.apiEndPoint + "/user/avatar/upload",
            data: avidata,
            processData: false,
            contentType: false,
            type: 'POST',
            success: function (data, textStatus, XMLHttpRequest) {
                that.opts.avatar = data;
                $('.previewAvi').remove();
                $(that.opts.idAvi).parent().prepend($("<div class='previewAvi'><img src='" + data + "' /></div>"));
            },
            error: function (response) {
                alert("Unable to upload avatar to Scribble Servers!");
            }
        });

        // show remove link
        $(that.opts.aviRmv).show();
    });

    // attach comment file image listener
    $(this.opts.idImg).change(function (evt) {
        
        var files = evt.target.files;

        // check if there was a file that was selected
        if (files.length == 0) {
            return;
        }

        var f = files[0];

        // check to make sure image type
        if (!f.type.match('image.*')) {
            alert("Not an image! Please try again.");
            return;
        }

        // create a file reader
        var previewReader = new FileReader();

        // Closure to capture the file information.
        previewReader.onload = (function (theFile) {
            return function (e) {
                // Render small preview.
                var imgprev = document.createElement('div');
                imgprev.innerHTML = ['<img class="' + that.opts.previewClass.substring(1) + '" src="', e.target.result,
                                  '" title="', escape(theFile.name), '"/>'].join('');
                $(evt.target).parent().prepend(imgprev);
            };
        })(f);

        // Read in the image file as a data URL.
        previewReader.readAsDataURL(f);

        $(that.opts.previewRmv).show();
    });

}

commentEngine.prototype.sendComment = function () {
    var that = this,
        username = $(this.opts.idName).val().trim(),
        comment = $(this.opts.idComment).val().trim(),
        file = $(this.opts.idImg)[0].files;
    
    // check if we are uploading an image
    if (typeof file !== "undefined" && file.length == 1) {
        file = file[0];
    }

    // check to make sure comment isn't empty. Name can be empty and will be set to "Anonymous User"
    if (username.length == 0) {
        username = "Anonymous User";
    }

    if (comment.length == 0 && file === "undefined" ) {
        alert("Please fill out a comment before submitting.");
        return;
    }

    // send a call to see if event is open, if it is then send out comment
    $.ajax({
        url: this.opts.apiEndPoint + "/event/" + this.opts.threadId + "?format=json&Token=" + that.opts.token,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            if (response.IsLive == 1) {
                // create the user
                $.ajax({
                    url: that.opts.apiEndPoint + "/user/create" + "?format=json&Token=" + that.opts.token,
                    data: { Name: username, AvatarUrl: that.opts.avatar },
                    type: 'POST',
                    dataType: 'json',
                    success: function (data, textStatus, XMLHttpRequest) {
                        // send in the post
                        var filedata = new FormData();
                        if (typeof file !== "undefined") {
                            filedata.append('file', file);
                            filedata.append('Content', comment);
                        } else {
                            filedata.append('Content', comment);
                        }
                        filedata.append('Token', that.opts.token);
                        filedata.append('Auth', data.Auth);
                        $.ajax({
                            url: that.opts.apiEndPoint + "/event/" + that.opts.threadId + "?format=json",
                            data: filedata,
                            processData: false,
                            contentType: false,
                            type: 'POST',
                            success: function (data, textStatus, XMLHttpRequest) {
                                if (typeof data.Message !== "undefined") {
                                    $(that.opts.idMsg).html("Response: " + data.Message + ". Thanks for submitting.").show();
                                } else {
                                    $(that.opts.idMsg).html("Image Upload complete. Thanks for submitting.").show();
                                }
                                $(that.opts.previewClass).remove();
                                $(that.opts.idImg).val('');
                                $(that.opts.idComment).val("");
                                $(that.opts.previewRmv).hide();
                                window.setTimeout(function () { $(that.opts.idMsg).fadeOut("slow"); }, 2000);
                            },
                            error: function (response) {
                                alert("Unable to upload avatar to Scribble Servers!");
                            }
                        });
                    }
                });
            } else {
                alert("Event is closed. Comments cannot be submitted.");
            }
        }
    });
}
