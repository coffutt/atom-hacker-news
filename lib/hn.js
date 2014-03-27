var request = require('request'),
    cheerio = require('cheerio');

var parseHomePage = function (callback) {
    return function(err, res) {

        if(err) throw err;

        var $ = cheerio.load(res.body),
            linkColumns,
            links = [ ],
            modThree = function (mod) {
                return function (index) {
                    return index % 3 === mod;
                };
            };

        linkColumns = $('table')
            .find('table').filter(function (index) {
                return index === 1;
            })
            .find('tr').filter(modThree(0))
            .find('td').filter(modThree(2));

        linkColumns.each(function (index) {
            var a = $(this).find('a'),
                domain = $(this).find('span');

            links.push({
                rank: index+1,
                domain: domain.length > 0 ? domain.text().match(/\(([^)]+)\)/)[1] : '',
                url: a.attr('href'),
                title: a.text()
            });
        });

        callback(null, links);
    };
};

module.exports.loadTop = function (callback) {
    try {
        request("https://news.ycombinator.com/", parseHomePage(callback));
    } catch (err) {
        console.log(err);
        callback(err, null);
    }
};
