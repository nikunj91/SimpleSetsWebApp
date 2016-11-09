var randomstring = require("randomstring"),
    Random = require('random-js'),
    arrandom = require('arrandom');

var fuzzer = 
{
    random : new Random(Random.engines.mt19937().seed(0)),
    
    generateRandomStringArray: function (size)
    {
        var randomStringArray=[];
        for (var i = size - 1; i >= 0; i--) {
            randomStringArray[i]=randomstring.generate({length: fuzzer.random.integer(1,100), charset: 'alphanumeric'});
        };
        return arrandom(randomStringArray);
    },

    generateRandomMixedArray: function (size)
    {
        var randomStringArray=[];
        for (var i = size - 1; i >= 0; i--) {
            if(fuzzer.random.bool(0.5))
                randomStringArray[i]=randomstring.generate({length: fuzzer.random.integer(1,100), charset: 'alphanumeric'});
            else
                randomStringArray[i]=fuzzer.random.integer(1,10000);
        };
        return arrandom(randomStringArray);
    }

    
};

console.log(fuzzer.generateRandomStringArray(10));
console.log(fuzzer.generateRandomMixedArray(10));

