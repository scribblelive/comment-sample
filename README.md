ScribbleLive Comment Widget
===========
This widget allows users to submit comments to an event from either a stand alone webpage or in a Scribble UI that doesn't support commenting (e.g Pinboard, Timeline, etc.)

The html, css, and javascript code can be placed in any page or the top or bottom html of a Scribblelive whitelabel. In order to operate this widget you will need a Scribblelive API token and the id of an Event where the comments will be submitted to.

**__Creator: Natalia Bogdan__**

##Widget Requirements
This widget requires JQuery to be defined on the page where it is being used and for a browser that supports HTML5. The image and avatar uploads require the HTML5 file upload functinality.

##Widget Styling
The css for the look and feel of the widget is included in the sample.html file. If you wish to change the look and feel of the widget please feel free to modify the styles. Please leave the assigned classes and ids as they are. Some of the Javascript relies on specific ids. You can freely add your own classes and include them in the class list for the element that you wish to modify.

```HTML
<style type="text/css">
        body
        {
            background-color: #FFF;
        }

        #scrb-comment
        {
            margin: 0px;
            width: 280px;
            height: 111px;
        }

        .scrb-title
        {
            font-size: 20px;
            font-weight: bold;
            text-align: center;
        }

        .scrb-subtitle
        {
            font-size: 14px;
            font-weight: bold;
        }

        .scrb-container
        {
            padding: 10px;
        }

        #scribbleComments
        {
            width: 300px;
            margin: auto;
            border: solid 1px #919191;
            -webkit-border-radius: 10px;
            -moz-border-radius: 10px;
            border-radius: 10px;
            font-family: Helvetica,Arial,sans-serif;
            padding: 20px;
            background-color: #FFF;
        }

        #scrb-name
        {
            width: 232px;
        }

        #submitBtn
        {
            width: 100px;
            margin-left:auto;
            margin-right:auto;
            margin-top:10px;
            border: solid 1px #919191;
            -webkit-border-radius: 4px;
            -moz-border-radius: 4px;
            border-radius: 4px;
            text-align: center;
            padding: 5px;
            background-color: #ECECEC;
        }

        #submitBtn:hover
        {
            background-color: #FFF;
            cursor: pointer;
        }

        #scrb-msg
        {
            font-size: 12px;
            text-align: center;
            color: #919191;
        }

        .uploadContainer
        {
            margin-top: 10px;
        }

        .uploadContainer .scrb-container
        {
            border: solid 1px #C5C5C5;
            border-top: none;
        }

        .tabContainer
        {
            border-bottom: solid 1px #C5C5C5;
        }

        .tabContainer div
        {
            border: solid 1px #C5C5C5;
            border-bottom: none;
            display: inline-block;
            padding: 5px;
            background-color: #ECECEC;
        }

        .tabContainer div.selected
        {
            background-color: #FFF;
        }

        .tabContainer div:hover
        {
            background-color: #FFF;
            cursor: pointer;
        }

        .containerHidden
        {
            display: none;
        }

        .unavailable
        {
            display:none;
            padding: 10px;
        }

        .imgPrev
        {
            width: 100%;
        }

        #imgRmv,
        #aviRmv
        {
            font-size: 12px;
            color: #ff0000;
            display: none;
        }

        #imgRmv:hover,
        #aviRmv:hover
        {
            cursor: pointer;
        }
    </style>
```

##Widget Initialization
To set up the widget on your page you will need to at a javascript call once the page is finished loading to initialize the widget. The parameters you specify must match the ids or classes you assign to various input fields and preview divs so that the widget can function properly. If you are using the widget unmodified then you will just need to specify the api token and thread id. A description of each parameter can be found below.

```HTML
<script type="text/javascript">
        $(window).load(function () {
            // check if we have html 5 capabilities
            if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
                $('.scrb-container, .uploadContainer, #submitBtn').hide();
                $('.unavailable').show();
            } else {
                new commentEngine({
                    token: "YOURTOKEN",
                    threadId: "YOURTHREADID",
                    idName: "#scrb-name",
                    idComment: "#scrb-comment",
                    idSubmit: "#submitBtn",
                    idMsg: "#scrb-msg",
                    idAvi: "#scrb-avi",
                    idImg: "#scrb-img",
                    previewClass: ".imgPrev",
                    previewRmv: "#imgRmv",
                    aviRmv: "#aviRmv"
                });
            }
        });
</script>
```

__token__
The api token for your Scribblelive Client.

__threadId__
The thread id of the event where you want your comments submitted.

__idName__
The html id of the input field where the user enters their username. Used for processing the comment once the user hits submit.

__idComment__
The html id of the textarea input where the user enters their text comment. Used for processing the comment once the user hits submit.

__idSubmit__
The html id of the div that acts as the submit button. Please note that a div is used instead of an input button. This id is used to attach the javascript click listener to process the post.

__idMsg__
The html id of the div that will contain the error and processing messages returned from the Scribblelive API calls.

__idAvi__
The html id of the file input field where the user enters the avatar they wish to upload.

__idImg__
The html id of the file input field where the user enters the image file they wish to upload as their comment.

__previewClass__
The css class that will be added to the container that will hold the preview of the user uploaded comment image. This class can be used to style preview images and is added dynamically once an image is uploaded.

__previewRmv__
The html id of the div or span  that will act as a button to remove the user uploaded image. A click listener is initialized on this id to react to user clicks to remove the uploaded image.

__aviRmv__
The hmk id of the div or span that will act as a button to remove the user uploaded avatar. A click listener is initialized on this id to react to user clicks to remove the uploaded avatar. Please note: once the user uploads an avatar with one of their comments any further comments submitted in the same session will use the same avatar. The user can replace the avatar by uploading a new one with a comment. If the user refreshes the page their user session will be cleared and they will essentially be treated as a new user if they upload more comments under a new name and avatar. Cookie/Session functionality can be added to the javascript to handle these cases if necessary.

##Widget UI Functionality
The default widget is styled to have a tabbed appearance to allow the user to choose between uploading an image or a text comment. The following functions are called onclick for the tabs to switch between the inputs

```HTML
<script type="text/javascript">
        function imgClick(e) {
            $('.tabContainer div').removeClass('selected');
            $(e).addClass('selected');
            $('#textCommentBox').hide();
            $('#imgCommentBox').show();
        }

        function txtClick(e) {
            $('.tabContainer div').removeClass('selected');
            $(e).addClass('selected');
            $('#imgCommentBox').hide();
            $('#textCommentBox').show();
            $('#scrb-img').val('');
            $(".imgPrev").remove();
        }
</script>
```

##Widget HTML Definition
The widget itself is a fairly simple structure of containers and a few input files. You can add the following code unmodified to your page or change how and where the different containers behave. If you modify the containers and general look and feel please remember to map any of those changed back to the comment widget initialization.
```HTML
    <div id="scribbleComments">
        <div class="scrb-title">Submit a Comment</div>
        <div id="scrb-msg">
        </div>
        <div class="scrb-container">
            <span class="scrb-subtitle">Name:</span>
            <span><input type="text" placeholder="Name (optional)" id="scrb-name" /></span>
        </div>
        <div class="scrb-container">
            <span class="scrb-subtitle">Avatar (optional):</span>
            <span id="aviRmv">[x] remove</span>
            <span><input type="file" id="scrb-avi" /></span>
        </div>
        <div class="uploadContainer">
            <div class="tabContainer">
                <div class="selected" onclick="txtClick(this);">Text</div>
                <div onclick="imgClick(this);">Image</div>
            </div>
            <div id="textCommentBox" class="scrb-container">
                <div class="scrb-subtitle">Comment:</div>
                <div>
                    <textarea placeholder="Please enter your comment here." id="scrb-comment"></textarea>
                </div>
            </div>
            <div id="imgCommentBox" class="scrb-container containerHidden">
                <span class="scrb-subtitle">Image:</span>
                <span id="imgRmv">[x] remove</span>
                <span><input type="file" accept="image/*" id="scrb-img" /></span>
            </div>
        </div>
        <div id="submitBtn">
            Submit
        </div>
        <div class="unavailable"><i>HTML5 is not fully supported on your browser. You need to use a browser with these capabilities to submit a comment.</i></div>
    </div>
```
