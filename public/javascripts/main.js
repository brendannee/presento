var common = {},
    words = {},
    currentWord,
    lastWord,
    querying = false,
    typing = false;

$.getJSON('/javascripts/words.json', function(results) {
  results.forEach(function(word) {
    common[word.word] = true;
  })
});


$('#text').on('input', function() {
  $('#intro').slideUp();
  $('#result').slideDown();
  typing = true;
  setTimeout(typingDone, 2000);
  lastWord = getLastWord($('#text').val());
  processWords();
});


function processWords() {
  if(lastWord != currentWord && checkLastWord(lastWord) && !querying) {
    searchWord(lastWord);
  }
}


function getLastWord(string) {
  var list = string.split(' ');
  if(isCapitalized(list[list.length - 2]) && isCapitalized(list[list.length - 3])) {
    return list[list.length - 3] + ' ' + list[list.length - 2];
  } else {
    return list[list.length - 2];
  }
}


function isCapitalized(word) {
  return word && word[0] === word[0].toUpperCase();
}


function checkLastWord(word) {
  return (word && word.length > 2 && !common[word]);
}


function searchWord(word) {
  if(words[word]) {
    displayWord(word, words[word]);
  } else {
    querying = true;
    setTimeout(queryDone, 1000);
    $.getJSON('http://en.wikipedia.org/w/api.php?action=query&list=allimages&ailimit=5&aifrom=' + word + '&aiprop=dimensions%7Cmime%7Curl&format=json&callback=?')
      .done(function(results) {
        if(results.query.allimages.length) {
          var largestImage = _.max(_.filter(results.query.allimages, function(i) {
            return i.mime.indexOf('image') != -1;
          }), function(i) {
            return i.size;
          });
          
          currentWord = word;
          words[word] = largestImage.url;
          displayWord(word, largestImage.url);
        }
      });
  }
}


function displayWord(word, imageUrl) {
  $('#result .image').html($('<img>')
      .attr('src', imageUrl));

  $('#result .word').text(word);
}


function queryDone() {
  querying = false;
}


function typingDone() {
  typing = false;
  lastWord = getLastWord($('#text').val() + ' ');
  processWords();
}
