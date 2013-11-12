// Example model

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

// Authenticate Schema
var Account = new Schema ({
    //conflict with node so changed from domain
    domainProvider: { type: String, default: ''},
    uid:    { type: String, default: ''},
    email:  { type: String, default: ''},
    tokens: {  
        kind :      {type: String, default: ''},
        token :     {type: String, default: ''},
        tokenSecret:{type: String, default: ''}
    },
    streams: [{
        screen_name: { type: String, default: ''},
        maxid: { type: String, default: ''},
        count: { type: String, default: ''},
        content: { type: String, default: ''},
        dateRequested: { type: Date, default: Date.now() },
    }]
        
})


mongoose.model('Account', Account);
