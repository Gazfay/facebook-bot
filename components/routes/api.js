const algoliaService = require('../../services/algolia');

module.exports = function(webserver, controller) {
    webserver.get('/get-smiles', function(req, res) {

        return algoliaService.getLink(req.query.find)
            .then((data) => {
                return res.json({data: (data.length)? data : null});
            })
            .catch((err) => res.json(err.message));
    });

    webserver.get('/upload-image', function(req, res) {
        var attachment = {
             "type":"image",
             "payload":{
                 "url":""+ req.query.image_url +"",
                 "is_reusable": true
             }
         };
     
         controller.api.attachment_upload.upload(attachment, function (err, attachmentId) {
            if(err) {
                 // Error
            } else {
                var message = {
                    "attachment": {
                      "type": "template",
                      "payload": {
                         "template_type": "media",
                         "elements": [
                            {
                               "media_type": "image",
                               "attachment_id": attachmentId,
                               "buttons":[
                                    {
                                      "type": "web_url", 
                                      "url": "https://768cdd39.ngrok.io/",  // button with type url on web-view
                                      "title": "Find smile again",
                                      messenger_extensions: true,
                                      webview_height_ratio: 'tall',
                                    }              
                                ]  
                            }
                         ]
                      }
                    }
                }

                res.json(message);

             }
         });
    });
}