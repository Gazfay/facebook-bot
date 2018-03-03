const algoliaService = require('../services/algolia');


module.exports = function(controller) {

    controller.hears([/smile/i], ['message_received', 'facebook_postback'], function(bot, message) { // watch Smile command

      return algoliaService.getLink('') // try to find some pictures by empty string.
            .then((data) => {

              if (data.length !== 0) { 

                var attachment = {  // create atachment as type Image for uploading - see more types in facebook messenger templates.
                     "type":"image",
                     "payload":{
                         "url":""+ data[0] +"",
                         "is_reusable": true
                     }
                 };
             
                 controller.api.attachment_upload.upload(attachment, function (err, attachmentId) { // upload image on facebook server
                    if(err) {
                         // Error
                    } else {
                        var image = {
                            "attachment": {
                              "type": "template",
                              "payload": {
                                 "template_type": "media", // media type can render only facebook image or video.
                                 "elements": [
                                    {
                                       "media_type": "image",
                                       "attachment_id": attachmentId, // loaded image attachment id.
                                       "buttons":[
                                          {
                                            "type":"postback", // postback emmits facebook_postback event.
                                            "title":"Smile",
                                            "payload":"Smile"
                                          }              
                                        ]
                                    }
                                 ]
                              }
                            }
                        }

                        bot.replyWithTyping(message, image); 

                     }
                 });

              }
            })
            .catch((err) => res.json(err.message));

    });
}
