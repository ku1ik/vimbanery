class Vimbanery

  constructor: ->
    @handler = new KeySequenceHandler()
    @handler.register
      'j'   : @goDown
      '↓'   : @goDown
      'k'   : @goUp
      '↑'   : @goUp
      'h'   : @goLeft
      '←'   : @goLeft
      'l'   : @goRight
      '→'   : @goRight
      'J'   : @shiftDown
      'K'   : @shiftUp
      'H'   : @shiftLeft
      'L'   : @shiftRight
      'g,g' : @goTop
      'G'   : @goBottom
      'o'   : @toggleOpen
      '⏎'   : @toggleOpen
      'y'   : @copyLink
      'e,e' : @expandAll
      'e,c' : @expandComments
      'e,s' : @expandSubtasks
      'e,a' : @expandAttachments
      'e,g' : @expandGithub
      'c'   : @addComment
      's'   : @addSubtask
      'b'   : @addBlocker
      't'   : @editTitle
      'E'   : @editDescription
      'a'   : @addAfter
      'A'   : @addAtBottom
      'i'   : @addBefore
      'I'   : @addAtTop
      'x'   : @delete
      'g,i' : @goIcebox

  goDown: =>
    if t = @currentTask()
      if t.pos < @tasksCount(t.col) - 1
        @focusTask(t.col, t.pos + 1)
    else
      @focusTask(0, 0)

  goUp: =>
    if t = @currentTask()
      if t.pos > 0
        @focusTask(t.col, t.pos - 1)
    else
      @focusTask(0, 0)

  goLeft: =>
    if t = @currentTask()
      n = -1
      while t.col + n >= 0
        tc = @tasksCount(t.col + n)
        if tc > 0
          if t.pos < tc
            @focusTask(t.col + n, t.pos)
          else
            @focusTask(t.col + n, tc - 1)
          break
        n -= 1
    else
      @focusTask(0, 0)

  goRight: =>
    if t = @currentTask()
      n = 1
      while t.col + n < @columnsCount()
        tc = @tasksCount(t.col + n)
        if tc > 0
          if t.pos < tc
            @focusTask(t.col + n, t.pos)
          else
            @focusTask(t.col + n, tc - 1)
          break
        n += 1
    else
      @focusTask(0, 0)

  goTop: =>
    if t = @currentTask()
      @focusTask(t.col, 0)
    else
      @focusTask(0, 0)

  goBottom: =>
    if t = @currentTask()
      col = t.col
    else
      col = 0
    bottom = $(".column-view:eq(#{col}) .task-view").length - 1
    @focusTask(col, bottom)

  toggleOpen: =>
    if t = @currentTask()
      t.task.view().bodyToggler.toggle()

  shiftDown: =>
    if t = @currentTask()
      v = t.task.view()
      m = v.model
      if m.data.position + 1 <= v.parentView().modelViewList.all().length
        v.element.next().after(v.element.remove())
        v.updateModel(position: m.data.position + 1)
        @showTask(t.task)

  shiftUp: =>
    if t = @currentTask()
      v = t.task.view()
      m = v.model
      if m.data.position > 1
        v.element.prev().before(v.element.remove())
        v.updateModel(position: m.data.position - 1)
        @showTask(t.task)

  shiftRight: =>
    if t = @currentTask()
      @shiftToColumn(t.task, +1)

  shiftLeft: =>
    if t = @currentTask()
      @shiftToColumn(t.task, -1)

  shiftToColumn: (task, direction) ->
    v = task.view()
    m = v.model
    columns = @columns(v)
    newColIndex = m.column().data.position - 1 + direction

    if newColIndex >= 0 and newColIndex < columns.length
      newColView = v.parentView().modelViewList.htmlList.parentView().
        parentView().modelViewList.htmlList.element.
        find(".ul-columns-section-body .column-view:eq(#{newColIndex})").
        view().listViews.tasks.modelViewList.htmlList.element.
        find('.ul-tasks-section-body')

      newColView.append(v.element.remove())

      cid = columns[newColIndex].model.data.id
      newPos = @tasksCount(newColIndex)
      v.updateModel(column_id: cid, position: newPos)
      @showTask(task)

  editTitle: =>
    if t = @currentTask()
      f = new K.InlineForm(t.task.find('.disp-task-title'))

  editDescription: =>
    if t = @currentTask()
      @toggleOpen() if t.task.find('.disp-task-description:visible').length == 0
      f = new K.InlineForm(t.task.find('.disp-task-description'))

  expandAll: =>
    @expandComments()
    @expandSubtasks()

  expandComments: =>
    if t = @currentTask()
      v = t.task.view()
      v.listViews.comments.modelViewList.htmlList.toggleBodyAndShowUp()

  expandSubtasks: =>
    if t = @currentTask()
      v = t.task.view()
      v.listViews.subtasks.modelViewList.htmlList.toggleBodyAndShowUp()

  addComment: =>
    if t = @currentTask()
      v = t.task.view()
      @expandComments() if t.task.find('.comments-section .add-item-link:visible').length == 0
      t.task.find('.comments-section .add-item-link:visible').click()

  addSubtask: =>
    if t = @currentTask()
      v = t.task.view()
      @expandSubtasks() if t.task.find('.subtasks-section .add-item-link:visible').length == 0
      t.task.find('.subtasks-section .add-item-link:visible').click()

  columns: (view) ->
    view.parentView().modelViewList.htmlList.parentView().parentView().modelViewList.all()

  goIcebox: =>
    console.log 'icebox'

  currentTask: =>
    task = $('.task-view.v-focus:first')
    if task.length > 0
      pos = task.index()
      col = task.parents('.column-view').index()
      task: task, col: col, pos: pos

  focusTask: (col, pos) =>
    $('.task-view').removeClass('v-focus')
    task = $(".column-view:eq(#{col}) .task-view:eq(#{pos})").addClass('v-focus')
    task.view().loadBody()
    @showTask(task)
    task

  showTask: (task) ->
    list = task.parents('.tasks-section-body')
    list.scrollTo(task, { axis: 'y' }) unless @taskVisible(list, task)

  taskVisible: (parent, task) ->
    parentViewTop = $(parent).offset().top + $(parent).scrollTop()
    parentViewBottom = parentViewTop + $(parent).height()

    elemTop = $(task).offset().top
    elemBottom = elemTop + $(task).height()

    (elemBottom >= parentViewTop) and
      (elemTop <= parentViewBottom) and
      (elemBottom <= parentViewBottom) and
      (elemTop >= parentViewTop)

  columnsCount: =>
    $(".column-view").length

  tasksCount: (col) =>
    $(".column-view:eq(#{col}) .task-view").length


if window.Application
  v = new Vimbanery()
