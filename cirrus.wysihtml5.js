angular.module('cirrus.wysihtml5', [])
  .directive('wysihtml5', ['$parse', '$timeout', function ($parse, $timeout) {
    return {
      restrict: 'A',
      //require: 'ngModel',
      scope: {
        wysihtml5Dynamic: '@',
        clickToActivate: '@',
        height: '=',
        wysihtml5: '='
      },
      transclude: true,
      replace: true,
      template:
        // wysihtml5 must be enclosed in a div in order to not screw with angular
        '<div style="width:100%;margin:20px auto;background:white;box-shadow:0 0 0 1px #d1d1d1,0 0 1px 1px #ccc;">' +
          '<input type="text" placeholder="Add a comment..." ng-click="activate()" ng-show="clickToActivate" style="width:578px;height:41px;padding:10px 14px;border:none"/>' +
          '<div style="padding:40px;height:{{height}}px;" ng-show="!clickToActivate" >' +
            '<div id="{{element_id}}-toolbar">' +
              '<div class="btn-group">' +
                '<button class="btn btn-default btn-sm" data-wysihtml5-command="bold">Bold</button>' +
                '<button class="btn btn-default btn-sm" data-wysihtml5-command="italic">Italic</button>' +
                '<button class="btn btn-default btn-sm" data-wysihtml5-command="insertUnorderedList">Bullets</button>' +
                '<button class="btn btn-default btn-sm" data-wysihtml5-command="insertOrderedList">Numbers</button>' +
              '</div>' +
            '</div>' +
            '<textarea ng-model="wysihtml5" style="border:none;width:100%;margin-top:15px;height:{{+height*.75}}px;" />' +
          '</div>' +
        '</div>',

      link: function (scope, element, attrs) {

        element = element.find('textarea');

        scope.resize_editor = function () {
          var sandbox = element.siblings(".wysihtml5-sandbox");
          if(sandbox.height() != scope.editor.composer.element.offsetHeight) {
            // body style gives padding 1 px;
            var padding_border = sandbox.outerHeight() - sandbox.height();
            var height = scope.editor.composer.element.offsetHeight - 1 + padding_border;
            sandbox.height(height);
          }
        };

        scope.activate = function () {
          var clicked = scope.clickToActivate;
          scope.clickToActivate = undefined; // trigger proper heights


          // initialize wysihtml5 with the model
          scope.$parent.$watch(attrs.wysihtml5, function(after){
            element.val(after);
            scope.editor && scope.editor.synchronizer && scope.editor.synchronizer.fromTextareaToComposer();
          });

          // create wysihtml5
          scope.editor = new wysihtml5.Editor(scope.element_id, {
            toolbar: scope.element_id + '-toolbar',
            parserRules: wysihtml5ParserRules
          });

          // bind editor to the model
          scope.editor.on('blur', function () {
            if (scope.editor && scope.editor.synchronizer) {
              scope.editor.synchronizer.sync();
              scope.$apply(function () {
                scope.wysihtml5 = element.val();
              });

              scope.$apply(function () {
                scope.$emit('wysihtml5_blur');
              });
            }
          });

          scope.editor.on("load", function () {
            // remove min height style on body
            var styles = $(scope.editor.composer.doc).find('head style');
            styles.html(styles.html().replace('min-height: 100%; ', ''));

            // autosizing
            scope.resize_editor();
            $(scope.editor.composer.element).bind('input focus blur', scope.resize_editor);

            if (clicked) scope.editor.composer.element.focus();
          });

          // autosizing
          scope.editor.on("aftercommand:composer", scope.resize_editor);
        };

        scope.deactivate = function () {
          // FIX ME see https://github.com/xing/wysihtml5/issues/124
          scope.editor.composer.sandbox.destroy();
          element.show();
          scope.editor = null;
        };

        (function init() {
          // add a generated id
          scope.element_id = element.attr('id');
          if (!scope.element_id) {
            scope.element_id = "wysihtml5-textarea-" + new Date().getTime();
            element.attr('id', scope.element_id);
          }

          if (scope.wysihtml5Dynamic) {
            scope.$on("wysihtml5_activate", scope.activate);
            scope.$on("wysihtml5_deactivate", scope.deactivate);
          } else if (attrs.clickToActivate != undefined) {
            // handled in template
          } else {
            // bind template variables first (requiring {{element_id}}), then activate
            $timeout(scope.activate);
            //scope.activate();
          }
        })();
      }
    };
  }
]);