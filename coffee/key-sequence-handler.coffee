class KeySequenceHandler

  constructor: ->
    @sequence = []

  register: (map) ->
    @map = map
    $(document).keypress @handleKeyPress.bind(this)
    $(document).keydown @handleKeyDown.bind(this)

  handleKeyPress: (e) ->
    tagName = e.target.tagName
    return true if tagName is 'TEXTAREA' or tagName is 'INPUT'
    char = KEYCODES[e.which]
    @sequence.push char
    @dispatchSequence()
    false

  handleKeyDown: (e) ->
    tagName = e.target.tagName
    return true if tagName is 'TEXTAREA' or tagName is 'INPUT'
    if e.which >= 37 and e.which <= 40
      char = KEYCODES[e.which]
      @sequence.push char
      @dispatchSequence()
      false
    else
      true

  dispatchSequence: ->
    seq = @sequence.toString()
    console.log seq
    matches = (combo for combo, handler of @map when combo.substring(0, seq.length) is seq)

    if matches.length is 0
      @sequence = []
    else if matches.length is 1 and matches[0] is seq
      @sequence = []
      @map[seq]()
    else
      console.log "candidates: #{matches.join(' ')}"
