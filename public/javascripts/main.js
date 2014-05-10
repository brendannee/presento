var common = {},
    words = [],
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
  var words = string.split(' ');
  return words[words.length - 2];
}


function checkLastWord(word) {
  return (word && word.length > 2 && !common[word]);
}


function searchWord(word) {
  querying = true;
  setTimeout(queryDone, 1000);
  $.getJSON('http://en.wikipedia.org/w/api.php?action=query&list=allimages&ailimit=1&aifrom=' + word + '&aiprop=dimensions%7Cmime%7Curl&format=json&callback=?')
    .done(function(results) {
      if(results.query.allimages.length) {
        currentWord = word;
        var imageUrl = results.query.allimages[0].url;
        $('#result .image').html($('<img>')
            .attr('src', imageUrl));

        $('#result .word').text(word);
      }
    });
}


function queryDone() {
  querying = false;
}


function typingDone() {
  typing = false;
  lastWord = getLastWord($('#text').val() + ' ');
  processWords();
}
