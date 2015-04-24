// Generated by CoffeeScript 1.9.2
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    slice = [].slice;

  (function($, window) {
    var VoteForm;
    VoteForm = (function() {
      VoteForm.prototype.defaults = {
        selectors: {
          container: '.vtf',
          submit: '.vtf-submit',
          raty: '.raty',
          alert: {
            conteiner: '.vtf-alert',
            message: '.vtf-message',
            close: '.close'
          }
        }
      };

      function VoteForm(el, options) {
        this._showError = bind(this._showError, this);
        this.options = $.extend({}, this.defaults, options);
        this.selectors = this.options.selectors;
        this.$el = $(el);
        this.$ratys = this.$el.find(this.selectors.raty);
        this.data = {
          form: this.$el.data('form'),
          thread: this.$el.data('thread'),
          fields: jQuery.makeArray(this.$ratys.map(function() {
            var id, score;
            score = +$(this).data('score');
            id = +$(this).data('id');
            if (score && id) {
              return {
                id: id,
                value: score
              };
            }
          }))
        };
      }

      VoteForm.prototype.init = function() {
        if (!jQuery().raty) {
          document.write('<script src="' + this.options.vendorUrl + 'raty/lib/jquery.raty.js"></script>');
        }
        this._listeners();
        return this._ready();
      };

      VoteForm.prototype._listeners = function() {
        $(document).on('submit', this.selectors.container, function(e) {
          e.preventDefault();
          return false;
        });
        this.$el.on('click', this.selectors.alert.close, (function(_this) {
          return function() {
            return _this.$el.find(_this.selectors.alert.conteiner).hide();
          };
        })(this));
        this.$el.on('click', this.selectors.raty, (function(_this) {
          return function(e) {

            /*store @data.fields */
            var $this, id, score;
            $this = $(e.currentTarget);
            score = +$this.raty('score');
            id = +$this.data('id');
            if (score && id) {
              _this.data.fields = _this.data.fields.filter(function() {
                return this.id !== id;
              });
              _this.data.fields.push({
                id: id,
                value: score
              });
            }

            /*validation submit */
            if (_this.data.fields.length === _this.$ratys.length) {
              return _this.$el.find(_this.selectors.submit).removeAttr('disabled');
            }
          };
        })(this));
        return this.$el.on('click', this.selectors.submit, (function(_this) {
          return function() {
            _this.$el.find(_this.selectors.alert.conteiner).hide();
            _this.$el.find(_this.selectors.alert.message).html('');
            $.ajax({
              url: _this.options.actionUrl,
              type: 'post',
              dataType: 'json',
              data: $.extend({
                action: 'record/create_multiple'
              }, _this.data)
            }).done(function(data) {
              stop;
            }).fail(_this._showError);
          };
        })(this));
      };

      VoteForm.prototype._ready = function() {
        return $(document).ready((function(_this) {
          return function() {
            return _this.$ratys.raty({
              starType: 'i',
              number: 10,
              score: function() {
                return $(this).attr('data-score');
              }
            });
          };
        })(this));
      };

      VoteForm.prototype._showError = function(err) {
        var message, ref, ref1, ref2;
        message = ((ref = err.responseJSON) != null ? ref.message : void 0) ? ((ref1 = err.responseJSON) != null ? ref1.message : void 0) + '<br>' : '';
        if ((ref2 = err.responseJSON) != null ? ref2.errors : void 0) {
          jQuery.each(err.responseJSON.errors, function() {
            return message = message + this.msg + '<br>';
          });
        }
        if (!message) {
          message = 'неизвестная ошибка';
        }
        this.$el.find(this.selectors.alert.message).html(message);
        return this.$el.find(this.selectors.alert.conteiner).show();
      };

      return VoteForm;

    })();
    return $.fn.extend({
      voteForm: function() {
        var args, option;
        option = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        return this.each(function() {
          var $this, data;
          $this = $(this);
          data = $this.data('VoteForm');
          if (!data) {
            $this.data('VoteForm', (data = new VoteForm(this, option)));
            data.init();
          }
          if (typeof option === 'string') {
            return data[option].apply(data, args);
          }
        });
      }
    });
  })(window.jQuery, window);

  $('.vtf').voteForm(VoteFormsConfig);

}).call(this);

//# sourceMappingURL=voteforms.js.map
