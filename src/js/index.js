(() => {

const elRoot = document.getElementById('root');

const App = (() => {
    let $app = new DocumentFragment;

    let words = `Hello, world!`;

    let typed = '',
        /**
         * The index of the current character from words to be typed
         */
        currCharIndex = 0;

        let $elem = $('<div>');

        $elem
            .addClass('border m-3 p-5')
            .css({});

        let $typed = $('<span>');
        $typed.addClass('text-primary');
        $typed.text(typed);

        let $untyped = $('<span>');
        $untyped.addClass('text-dark');
        renderUntyped();

        $elem.append($typed, $untyped);
        $(elRoot).append($elem);

        let $retryBtn = $('<button>Retry</button>');
        $retryBtn.click(function() {
            currCharIndex = 0;
            $typed.text('');
            renderUntyped();
            $(this).css('display', 'none');
        });
        $retryBtn.css('display', 'none');
        $(elRoot).append($retryBtn);

    function renderUntyped() {
        $untyped.text(words.slice(currCharIndex));
    }

    $('body').css({'font-family': 'monospace'});
    $(document)[0].addEventListener('keydown', keypressHandler);

    const letters = new Set('abcdefghijklmnopqrstuvwxyz'.split('')),
          numbers = new Set('1234567890'.split('')),
          special = new Set(' `~!@#$%^&*()-_=+{}[]\\|;:\'"<>,./?'.split('')),
          isLetter = l => letters.has(l),
          isNumber = l => numbers.has(l),
          isSpecial = l => special.has(l),
          isTypable = c => [isLetter, isNumber, isSpecial].find(fn => fn(c));

    window.isTypable = isTypable;

    function keypressHandler(e) {
        // console.log('pressed', e.key, e.code);

        if (currCharIndex >= words.length)
            return;

        if (isTypable(e.key.toLowerCase())) {
            let currChar = words[currCharIndex];
            if (e.key == currChar)
                $typed.append(`<span class="text-success">${ currChar }</span>`);
            else
                $typed.append(`<span class="text-danger">${ e.key }</span>`);
            typed += e.key;
            currCharIndex++;
        } else if (e.key.toLowerCase() == 'backspace') {
            let deletedLetter = typed.slice(-1);

            typed = typed.slice(0, -1);
            $typed.children().eq(-1).remove();
            currCharIndex--;
        }

        renderUntyped();

        if (currCharIndex >= words.length) {
            setTimeout(() => {
                alert('finished!');
                $retryBtn.css('display', '');
            }, 150);
        }
    }

    return $app;
})();




})();
