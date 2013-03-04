/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

(function(){

// Private helper vars
var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;

var _ = self.Prism = {
  util: {
    type: function (o) {
      return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
    },

    // Deep clone a language definition (e.g. to extend it)
    clone: function (o) {
      var type = _.util.type(o);

      switch (type) {
        case 'Object':
          var clone = {};

          for (var key in o) {
            if (o.hasOwnProperty(key)) {
              clone[key] = _.util.clone(o[key]);
            }
          }

          return clone;

        case 'Array':
          return o.slice();
      }

      return o;
    }
  },

  languages: {
    extend: function (id, redef) {
      var lang = _.util.clone(_.languages[id]);

      for (var key in redef) {
        lang[key] = redef[key];
      }

      return lang;
    },

    // Insert a token before another token in a language literal
    insertBefore: function (inside, before, insert, root) {
      root = root || _.languages;
      var grammar = root[inside];
      var ret = {};

      for (var token in grammar) {

        if (grammar.hasOwnProperty(token)) {

          if (token == before) {

            for (var newToken in insert) {

              if (insert.hasOwnProperty(newToken)) {
                ret[newToken] = insert[newToken];
              }
            }
          }

          ret[token] = grammar[token];
        }
      }

      return root[inside] = ret;
    },

    // Traverse a language definition with Depth First Search
    DFS: function(o, callback) {
      for (var i in o) {
        callback.call(o, i, o[i]);

        if (_.util.type(o) === 'Object') {
          _.languages.DFS(o[i], callback);
        }
      }
    }
  },

  highlightAll: function(async, callback) {
    var elements = document.querySelectorAll('code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code');

    for (var i=0, element; element = elements[i++];) {
      _.highlightElement(element, async === true, callback);
    }
  },

  highlightElement: function(element, async, callback) {
    // Find language
    var language, grammar, parent = element;

    while (parent && !lang.test(parent.className)) {
      parent = parent.parentNode;
    }

    if (parent) {
      language = (parent.className.match(lang) || [,''])[1];
      grammar = _.languages[language];
    }

    if (!grammar) {
      return;
    }

    // Set language on the element, if not present
    element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    // Set language on the parent, for styling
    parent = element.parentNode;

    if (/pre/i.test(parent.nodeName)) {
      parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    }

    var code = element.textContent;

    if(!code) {
      return;
    }

    code = code.replace(/&/g, '&amp;').replace(/</g, '&lt;')
               .replace(/>/g, '&gt;').replace(/\u00a0/g, ' ');
    //console.time(code.slice(0,50));

    var env = {
      element: element,
      language: language,
      grammar: grammar,
      code: code
    };

    _.hooks.run('before-highlight', env);

    if (async && self.Worker) {
      var worker = new Worker(_.filename);

      worker.onmessage = function(evt) {
        env.highlightedCode = Token.stringify(JSON.parse(evt.data));
        env.element.innerHTML = env.highlightedCode;

        callback && callback.call(env.element);
        //console.timeEnd(code.slice(0,50));
        _.hooks.run('after-highlight', env);
      };

      worker.postMessage(JSON.stringify({
        language: env.language,
        code: env.code
      }));
    }
    else {
      env.highlightedCode = _.highlight(env.code, env.grammar)
      env.element.innerHTML = env.highlightedCode;

      callback && callback.call(element);

      _.hooks.run('after-highlight', env);
      //console.timeEnd(code.slice(0,50));
    }
  },

  highlight: function (text, grammar) {
    return Token.stringify(_.tokenize(text, grammar));
  },

  tokenize: function(text, grammar) {
    var Token = _.Token;

    var strarr = [text];

    var rest = grammar.rest;

    if (rest) {
      for (var token in rest) {
        grammar[token] = rest[token];
      }

      delete grammar.rest;
    }

    tokenloop: for (var token in grammar) {
      if(!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }

      var pattern = grammar[token],
        inside = pattern.inside,
        lookbehind = !!pattern.lookbehind || 0;

      pattern = pattern.pattern || pattern;

      for (var i=0; i<strarr.length; i++) { // Don’t cache length as it changes during the loop

        var str = strarr[i];

        if (strarr.length > text.length) {
          // Something went terribly wrong, ABORT, ABORT!
          break tokenloop;
        }

        if (str instanceof Token) {
          continue;
        }

        pattern.lastIndex = 0;

        var match = pattern.exec(str);

        if (match) {
          if(lookbehind) {
            lookbehind = match[1].length;
          }

          var from = match.index - 1 + lookbehind,
              match = match[0].slice(lookbehind),
              len = match.length,
              to = from + len,
            before = str.slice(0, from + 1),
            after = str.slice(to + 1);

          var args = [i, 1];

          if (before) {
            args.push(before);
          }

          var wrapped = new Token(token, inside? _.tokenize(match, inside) : match);

          args.push(wrapped);

          if (after) {
            args.push(after);
          }

          Array.prototype.splice.apply(strarr, args);
        }
      }
    }

    return strarr;
  },

  hooks: {
    all: {},

    add: function (name, callback) {
      var hooks = _.hooks.all;

      hooks[name] = hooks[name] || [];

      hooks[name].push(callback);
    },

    run: function (name, env) {
      var callbacks = _.hooks.all[name];

      if (!callbacks || !callbacks.length) {
        return;
      }

      for (var i=0, callback; callback = callbacks[i++];) {
        callback(env);
      }
    }
  }
};

var Token = _.Token = function(type, content) {
  this.type = type;
  this.content = content;
};

Token.stringify = function(o) {
  if (typeof o == 'string') {
    return o;
  }

  if (Object.prototype.toString.call(o) == '[object Array]') {
    for (var i=0; i<o.length; i++) {
      o[i] = Token.stringify(o[i]);
    }

    return o.join('');
  }

  var env = {
    type: o.type,
    content: Token.stringify(o.content),
    tag: 'span',
    classes: ['token', o.type],
    attributes: {}
  };

  if (env.type == 'comment') {
    env.attributes['spellcheck'] = 'true';
  }

  _.hooks.run('wrap', env);

  var attributes = '';

  for (var name in env.attributes) {
    attributes += name + '="' + (env.attributes[name] || '') + '"';
  }

  return '<' + env.tag + ' class="' + env.classes.join(' ') + '" ' + attributes + '>' + env.content + '</' + env.tag + '>';

};

if (!self.document) {
  // In worker
  self.addEventListener('message', function(evt) {
    var message = JSON.parse(evt.data),
        lang = message.language,
        code = message.code;

    self.postMessage(JSON.stringify(_.tokenize(code, _.languages[lang])));
    self.close();
  }, false);

  return;
}

// Get current script and highlight
var script = document.getElementsByTagName('script');

script = script[script.length - 1];

if (script) {
  _.filename = script.src;

  if (document.addEventListener && !script.hasAttribute('data-manual')) {
    document.addEventListener('DOMContentLoaded', _.highlightAll);
  }
}

})();;
Prism.languages.markup = {
  'comment': /&lt;!--[\w\W]*?--(&gt;|&gt;)/g,
  'prolog': /&lt;\?.+?\?&gt;/,
  'doctype': /&lt;!DOCTYPE.+?&gt;/,
  'cdata': /&lt;!\[CDATA\[[\w\W]*?]]&gt;/i,
  'tag': {
    pattern: /&lt;\/?[\w:-]+\s*(?:\s+[\w:-]+(?:=(?:("|')(\\?[\w\W])*?\1|\w+))?\s*)*\/?&gt;/gi,
    inside: {
      'tag': {
        pattern: /^&lt;\/?[\w:-]+/i,
        inside: {
          'punctuation': /^&lt;\/?/,
          'namespace': /^[\w-]+?:/
        }
      },
      'attr-value': {
        pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/gi,
        inside: {
          'punctuation': /=|&gt;|"/g
        }
      },
      'punctuation': /\/?&gt;/g,
      'attr-name': {
        pattern: /[\w:-]+/g,
        inside: {
          'namespace': /^[\w-]+?:/
        }
      }
    }
  },
  'entity': /&amp;#?[\da-z]{1,8};/gi
};
Prism.languages.haml = {
  'string': /("|')(\\?.)*?\1/g,
  'comment': /\/[^\r\n]*(\r?\n|$)/g,
  'boolean': /\b(true|false)\b/g,
  'number': /\b-?(0x)?\d*\.?\d+\b/g,
  'tag': /%[a-zA-Z_0-9]*\b/g,
  'var': /[@&]\b[a-zA-Z_0-9]*[?!]?\b/g,
  'operator': /[-+]{1,2}|!|={1,2}|(&amp;){1,2}|\|?\||\?|\*|\//g,
  'rails': /(form_tag|do|end|link_to|image_tag|content_for)/g,
  'ignore': /&(lt|gt|amp);/gi
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});;

(function() {
  var markAsSelected = function(selectedOption) {
    var options = document.getElementById('width-options').getElementsByClassName('width-option');

    for (var i = 0; i < options.length; i++) {
      options[i].className = 'width-option';
    }

    selectedOption.className += ' selected';
  };

  var showHideWidth = function() {
    var options = document.getElementById('width-options');
    var display = options.style.display;

    if (display === undefined || display === 'inline-table') {
      options.style.display = 'none';
    } else {
      options.style.display = 'inline-table';
    }
  };

  var changeWidth = function(event) {
    var selectedOption, selectedWidth, previews;
    selectedOption = event.target;
    selectedWidth = selectedOption.getAttribute('data-width');
    previews = document.getElementsByClassName('preview');

    markAsSelected(selectedOption);

    for (var i = 0; i < previews.length; i++) {
      previews[i].style.width = selectedWidth;
    }
  };

  var bindChangeWidth = function() {
    var options = document.getElementById('width-options').getElementsByClassName('width-option');
    for (var i = 0; i < options.length; i++) {
      options[i].addEventListener('click', changeWidth);
    }
  };

  var bindShowHideWidth = function() {
    var widthSelector = document.getElementById('width-selector');
    widthSelector.addEventListener('click', showHideWidth);
  };

  window.addEventListener && window.addEventListener('load', function() {
    bindChangeWidth();
    bindShowHideWidth();
  });
})();
