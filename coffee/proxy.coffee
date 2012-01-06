class Proxy

  constructor: (@document) ->
    @body = @document.getElementsByTagName('body')[0]
    @injectScript(@_listener)

  injectScript: (code, name=null, src=null) ->
    code = code.toString()

    if code.length > 0
      if name?
        code = "#{name} = #{code}"
      else
        code = "(#{code})()"

    if name and script = document.getElementById(name)
      script.innerHTML = code
    else
      script = @document.createElement("script")
      script.type = "text/javascript"
      script.id = name if name?
      script.src = src if src?
      script.innerHTML = code
      @document.head.appendChild(script)

  _listener: ->
    console.log 'adding listener'
    document.getElementsByTagName('body')[0].addEventListener('vimbanery-exec', -> _vimbaneryAction())

  injectAction: (f) ->
    console.log 'injecting new action'
    @injectScript(f, '_vimbaneryAction')

  exec: (f) ->
    @injectAction(f)
    event = document.createEvent('Event')
    event.initEvent('vimbanery-exec', true, true)
    @body.dispatchEvent(event)
