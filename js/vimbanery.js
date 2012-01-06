var Vimbanery, v,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

Vimbanery = (function() {

  function Vimbanery() {
    this.tasksCount = __bind(this.tasksCount, this);
    this.columnsCount = __bind(this.columnsCount, this);
    this.focusTask = __bind(this.focusTask, this);
    this.currentTask = __bind(this.currentTask, this);
    this.goIcebox = __bind(this.goIcebox, this);
    this.addSubtask = __bind(this.addSubtask, this);
    this.addComment = __bind(this.addComment, this);
    this.expandSubtasks = __bind(this.expandSubtasks, this);
    this.expandComments = __bind(this.expandComments, this);
    this.expandAll = __bind(this.expandAll, this);
    this.editDescription = __bind(this.editDescription, this);
    this.editTitle = __bind(this.editTitle, this);
    this.shiftLeft = __bind(this.shiftLeft, this);
    this.shiftRight = __bind(this.shiftRight, this);
    this.shiftUp = __bind(this.shiftUp, this);
    this.shiftDown = __bind(this.shiftDown, this);
    this.toggleOpen = __bind(this.toggleOpen, this);
    this.goBottom = __bind(this.goBottom, this);
    this.goTop = __bind(this.goTop, this);
    this.goRight = __bind(this.goRight, this);
    this.goLeft = __bind(this.goLeft, this);
    this.goUp = __bind(this.goUp, this);
    this.goDown = __bind(this.goDown, this);    this.handler = new KeySequenceHandler();
    this.handler.register({
      'j': this.goDown,
      '↓': this.goDown,
      'k': this.goUp,
      '↑': this.goUp,
      'h': this.goLeft,
      '←': this.goLeft,
      'l': this.goRight,
      '→': this.goRight,
      'J': this.shiftDown,
      'K': this.shiftUp,
      'H': this.shiftLeft,
      'L': this.shiftRight,
      'g,g': this.goTop,
      'G': this.goBottom,
      'o': this.toggleOpen,
      '⏎': this.toggleOpen,
      'y': this.copyLink,
      'e,e': this.expandAll,
      'e,c': this.expandComments,
      'e,s': this.expandSubtasks,
      'e,a': this.expandAttachments,
      'e,g': this.expandGithub,
      'c': this.addComment,
      's': this.addSubtask,
      'b': this.addBlocker,
      't': this.editTitle,
      'E': this.editDescription,
      'a': this.addAfter,
      'A': this.addAtBottom,
      'i': this.addBefore,
      'I': this.addAtTop,
      'x': this["delete"],
      'g,i': this.goIcebox
    });
  }

  Vimbanery.prototype.goDown = function() {
    var t;
    if (t = this.currentTask()) {
      if (t.pos < this.tasksCount(t.col) - 1) {
        return this.focusTask(t.col, t.pos + 1);
      }
    } else {
      return this.focusTask(0, 0);
    }
  };

  Vimbanery.prototype.goUp = function() {
    var t;
    if (t = this.currentTask()) {
      if (t.pos > 0) return this.focusTask(t.col, t.pos - 1);
    } else {
      return this.focusTask(0, 0);
    }
  };

  Vimbanery.prototype.goLeft = function() {
    var n, t, tc, _results;
    if (t = this.currentTask()) {
      n = -1;
      _results = [];
      while (t.col + n >= 0) {
        tc = this.tasksCount(t.col + n);
        if (tc > 0) {
          if (t.pos < tc) {
            this.focusTask(t.col + n, t.pos);
          } else {
            this.focusTask(t.col + n, tc - 1);
          }
          break;
        }
        _results.push(n -= 1);
      }
      return _results;
    } else {
      return this.focusTask(0, 0);
    }
  };

  Vimbanery.prototype.goRight = function() {
    var n, t, tc, _results;
    if (t = this.currentTask()) {
      n = 1;
      _results = [];
      while (t.col + n < this.columnsCount()) {
        tc = this.tasksCount(t.col + n);
        if (tc > 0) {
          if (t.pos < tc) {
            this.focusTask(t.col + n, t.pos);
          } else {
            this.focusTask(t.col + n, tc - 1);
          }
          break;
        }
        _results.push(n += 1);
      }
      return _results;
    } else {
      return this.focusTask(0, 0);
    }
  };

  Vimbanery.prototype.goTop = function() {
    var t;
    if (t = this.currentTask()) {
      return this.focusTask(t.col, 0);
    } else {
      return this.focusTask(0, 0);
    }
  };

  Vimbanery.prototype.goBottom = function() {
    var bottom, col, t;
    if (t = this.currentTask()) {
      col = t.col;
    } else {
      col = 0;
    }
    bottom = $(".column-view:eq(" + col + ") .task-view").length - 1;
    return this.focusTask(col, bottom);
  };

  Vimbanery.prototype.toggleOpen = function() {
    var t;
    if (t = this.currentTask()) return t.task.view().bodyToggler.toggle();
  };

  Vimbanery.prototype.shiftDown = function() {
    var m, t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      m = v.model;
      if (m.data.position + 1 <= v.parentView().modelViewList.all().length) {
        v.element.next().after(v.element.remove());
        v.updateModel({
          position: m.data.position + 1
        });
        return this.showTask(t.task);
      }
    }
  };

  Vimbanery.prototype.shiftUp = function() {
    var m, t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      m = v.model;
      if (m.data.position > 1) {
        v.element.prev().before(v.element.remove());
        v.updateModel({
          position: m.data.position - 1
        });
        return this.showTask(t.task);
      }
    }
  };

  Vimbanery.prototype.shiftRight = function() {
    var t;
    if (t = this.currentTask()) return this.shiftToColumn(t.task, +1);
  };

  Vimbanery.prototype.shiftLeft = function() {
    var t;
    if (t = this.currentTask()) return this.shiftToColumn(t.task, -1);
  };

  Vimbanery.prototype.shiftToColumn = function(task, direction) {
    var cid, columns, m, newColIndex, newColView, newPos, v;
    v = task.view();
    m = v.model;
    columns = this.columns(v);
    newColIndex = m.column().data.position - 1 + direction;
    if (newColIndex >= 0 && newColIndex < columns.length) {
      newColView = v.parentView().modelViewList.htmlList.parentView().parentView().modelViewList.htmlList.element.find(".ul-columns-section-body .column-view:eq(" + newColIndex + ")").view().listViews.tasks.modelViewList.htmlList.element.find('.ul-tasks-section-body');
      newColView.append(v.element.remove());
      cid = columns[newColIndex].model.data.id;
      newPos = this.tasksCount(newColIndex);
      v.updateModel({
        column_id: cid,
        position: newPos
      });
      return this.showTask(task);
    }
  };

  Vimbanery.prototype.editTitle = function() {
    var f, t;
    if (t = this.currentTask()) {
      return f = new K.InlineForm(t.task.find('.disp-task-title'));
    }
  };

  Vimbanery.prototype.editDescription = function() {
    var f, t;
    if (t = this.currentTask()) {
      if (t.task.find('.disp-task-description:visible').length === 0) {
        this.toggleOpen();
      }
      return f = new K.InlineForm(t.task.find('.disp-task-description'));
    }
  };

  Vimbanery.prototype.expandAll = function() {
    this.expandComments();
    return this.expandSubtasks();
  };

  Vimbanery.prototype.expandComments = function() {
    var t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      return v.listViews.comments.modelViewList.htmlList.toggleBodyAndShowUp();
    }
  };

  Vimbanery.prototype.expandSubtasks = function() {
    var t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      return v.listViews.subtasks.modelViewList.htmlList.toggleBodyAndShowUp();
    }
  };

  Vimbanery.prototype.addComment = function() {
    var t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      if (t.task.find('.comments-section .add-item-link:visible').length === 0) {
        this.expandComments();
      }
      return t.task.find('.comments-section .add-item-link:visible').click();
    }
  };

  Vimbanery.prototype.addSubtask = function() {
    var t, v;
    if (t = this.currentTask()) {
      v = t.task.view();
      if (t.task.find('.subtasks-section .add-item-link:visible').length === 0) {
        this.expandSubtasks();
      }
      return t.task.find('.subtasks-section .add-item-link:visible').click();
    }
  };

  Vimbanery.prototype.columns = function(view) {
    return view.parentView().modelViewList.htmlList.parentView().parentView().modelViewList.all();
  };

  Vimbanery.prototype.goIcebox = function() {
    return console.log('icebox');
  };

  Vimbanery.prototype.currentTask = function() {
    var col, pos, task;
    task = $('.task-view.v-focus:first');
    if (task.length > 0) {
      pos = task.index();
      col = task.parents('.column-view').index();
      return {
        task: task,
        col: col,
        pos: pos
      };
    }
  };

  Vimbanery.prototype.focusTask = function(col, pos) {
    var task;
    $('.task-view').removeClass('v-focus');
    task = $(".column-view:eq(" + col + ") .task-view:eq(" + pos + ")").addClass('v-focus');
    task.view().loadBody();
    this.showTask(task);
    return task;
  };

  Vimbanery.prototype.showTask = function(task) {
    var list;
    list = task.parents('.tasks-section-body');
    if (!this.taskVisible(list, task)) {
      return list.scrollTo(task, {
        axis: 'y'
      });
    }
  };

  Vimbanery.prototype.taskVisible = function(parent, task) {
    var elemBottom, elemTop, parentViewBottom, parentViewTop;
    parentViewTop = $(parent).offset().top + $(parent).scrollTop();
    parentViewBottom = parentViewTop + $(parent).height();
    elemTop = $(task).offset().top;
    elemBottom = elemTop + $(task).height();
    return (elemBottom >= parentViewTop) && (elemTop <= parentViewBottom) && (elemBottom <= parentViewBottom) && (elemTop >= parentViewTop);
  };

  Vimbanery.prototype.columnsCount = function() {
    return $(".column-view").length;
  };

  Vimbanery.prototype.tasksCount = function(col) {
    return $(".column-view:eq(" + col + ") .task-view").length;
  };

  return Vimbanery;

})();

if (window.Application) v = new Vimbanery();
