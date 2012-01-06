var KeySequenceHandler;

KeySequenceHandler = (function() {

  function KeySequenceHandler() {
    this.sequence = [];
  }

  KeySequenceHandler.prototype.register = function(map) {
    this.map = map;
    $(document).keypress(this.handleKeyPress.bind(this));
    return $(document).keydown(this.handleKeyDown.bind(this));
  };

  KeySequenceHandler.prototype.handleKeyPress = function(e) {
    var char, tagName;
    tagName = e.target.tagName;
    if (tagName === 'TEXTAREA' || tagName === 'INPUT') return true;
    char = KEYCODES[e.which];
    this.sequence.push(char);
    this.dispatchSequence();
    return false;
  };

  KeySequenceHandler.prototype.handleKeyDown = function(e) {
    var char, tagName;
    tagName = e.target.tagName;
    if (tagName === 'TEXTAREA' || tagName === 'INPUT') return true;
    if (e.which >= 37 && e.which <= 40) {
      char = KEYCODES[e.which];
      this.sequence.push(char);
      this.dispatchSequence();
      return false;
    } else {
      return true;
    }
  };

  KeySequenceHandler.prototype.dispatchSequence = function() {
    var combo, handler, matches, seq;
    seq = this.sequence.toString();
    console.log(seq);
    matches = (function() {
      var _ref, _results;
      _ref = this.map;
      _results = [];
      for (combo in _ref) {
        handler = _ref[combo];
        if (combo.substring(0, seq.length) === seq) _results.push(combo);
      }
      return _results;
    }).call(this);
    if (matches.length === 0) {
      return this.sequence = [];
    } else if (matches.length === 1 && matches[0] === seq) {
      this.sequence = [];
      return this.map[seq]();
    } else {
      return console.log("candidates: " + (matches.join(' ')));
    }
  };

  return KeySequenceHandler;

})();
