window.fbAsyncInit = function() {

}; // callback when MessengerExtensions have loaded.

var app = {
  globalLoader: $('.loader-app, .loader-app-wrapper'),
  smileLoader: $('.loader-smile, .loader-smile-wrapper'),
  previewText: $('.preview'),
  smileView: $('.updates')
}

var request = false;


$(document).ready(function() {
  app.globalLoader.removeAttr('style');
});


setRequestSmilesEvent();
setSmileClickEvent();


function loadSmile(data) {
  if (data) {
    var image = new Image();
    image.onload = function() {
      setTimeout(function() {
        app.smileLoader.fadeOut();
      }, 300);
    }
    image.src = data[0];
  } else {
    app.smileLoader.fadeOut();
  }
}

function setRequestSmilesEvent() {
  $('.call-smiles').click(function() {
    if (!request) { 

      request = true;
      app.previewText.hide();
      app.smileLoader.show();

      $.get("/get-smiles",  { find: ''+ $('.find-input').val() +'' })
        .done(function(res) {
          let data = {};
          var template = Handlebars.compile($('#template').html());
          if (res.data !== null) {
            data = {list: res};
          }

          app.smileView.empty();
          app.smileView.append(template(data));
          setSmileClickEvent();
          setRequestSmilesEvent();
          loadSmile(res.data);
          request = false;
        })
        .fail(function(err) {
          app.smileLoader.fadeOut();
          request = false;
        });

    }

  });
}

function setSmileClickEvent() {
  $('.send-button').on("click", function() {
    var url = $('.shared-image').attr('data-url');
    url = url.substring(0, url.length - 1);
    app.smileLoader.show();

    $.get("/upload-image",  { image_url: url }) //try upload checked image
      .done(function(message) {
        window.MessengerExtensions.beginShareFlow( //try to share message from web-view
          function success(response) {
            if (response.is_sent) {
              window.MessengerExtensions.requestCloseBrowser(null, null); // after done sent response we hide web-view.
            }
          }, function error(errorCode, errorMessage) {
            console.error({errorCode, errorMessage});
          },
          message, // generated message config by server.
          "current_thread"); // current_thread mean that we want send message in current chat.
          })
      .fail(function(err) {
        console.log(err)
      })

  });
}

