var osmosis = require("osmosis"), IncomingWebhook = require("@slack/client").IncomingWebhook, fs = require("fs");

const postcode = "", url = "https://www.kettering.gov.uk/site/custom_scripts/refuse_collection_search.php", webhook = "";

osmosis
.post(url, { pcode_input: postcode })
.set({
    "next": "//article[@id='content']/div[@class='boxed']/p[1]",
    "bins": "//article[@id='content']/div[@class='boxed']/p[2]"
})
.data(function(data){
    if(!data.next || !data.bins) return;
    
    nextPerson(function(person) {
        new IncomingWebhook(webhook).send(data.next + "\n" + data.bins + "\n<@" + person + ">");
    });
});

const people = ["", "", ""];

function nextPerson( callback ) {
    var filename = __dirname + "\\person";

    fs.readFile(filename, 'utf8', function (err, data) {
        if( !err || err.code == "ENOENT" )
        {
            var index = 0;
            if( data ) index = people.indexOf(data) + 1;
            if( index == people.length ) index = 0;

            fs.writeFile(filename, people[index], function(){
                callback(people[index]);
            });
        }
    });
}
