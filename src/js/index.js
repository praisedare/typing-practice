"use strict";
(() => {

const elRoot = document.getElementById('root');

const App = (() => {
    let words = `"I've always been fascinated by attachment theory, which does a wonderful job of explaining how pivotal early events color all of life. Leslie Becker-Phelps helps us understand how 'anxious attachment' plays itself out in our current relationships - and what we can do to heal from that substantial early wound. Highly recommended!"`;
    let typed = '',
        /**
         * The index of the current character from words to be typed
         */
        currCharIndex = 0,

        /**
         * The number of mistakes made
         */
        mistakesCount = 0,

        timer = (() => {
            let _startTime,
                _timer,
                _prevDuration = 0,
                _isRunning = false;

            return {
                start() {
                    _isRunning = true;
                    return _startTime = Date.now();
                },
                stop() {
                    _isRunning = false;
                    return _prevDuration = Date.now() - this.startTime;
                },
                get isRunning() {
                    return _isRunning;
                },
                get startTime() {
                    return _startTime;
                },
                get runTime() {
                    return this.isRunning ? 
                        Date.now() - this.startTime :
                        this.prevDuration;
                },
                get prevDuration() {
                    return _prevDuration;
                },
            };
        })(),

        $typingSpeedIndicator = (() => {
            let $e = $('<div class="typing-speed text-primary"><span class="typing-speed__num">0</span> WPM</div>');

            return $e;
        })();

        let $app = $('<div>');

        $app
            .addClass('border m-3 p-5')
            .css({'white-space': 'pre-wrap', 'word-break': 'break-all',});

        let $typed = $('<span>');
        $typed.addClass('text-primary');
        $typed.text(typed);

        let $untyped = $('<span>');
        $untyped.addClass('text-dark');
        renderUntyped();

        $app.append($typed, $untyped, $typingSpeedIndicator);
        $(elRoot).append($app);

        let $startBtn = $('<button>Start</button>')
            .click(startTypingSession)
            .addClass('btn btn-success');
        $(elRoot).append($startBtn);

        let $retryBtn = $('<button>Retry</button>')
            .click(startTypingSession)
            .css({display: 'none'})
            .addClass('btn btn-primary mx-3');
        $(elRoot).append($retryBtn);

    function renderUntyped() {
        $untyped.text(words.slice(currCharIndex));
    }

    window.timer = timer;

    function calculateTypingSpeed() {
        let runTime = timer.runTime / 1000,
            minutes = runTime / 60;
        return (currCharIndex + 1) / 5 / minutes;
    }

    function updateTypingSpeed() {
        let speed = calculateTypingSpeed();
        $typingSpeedIndicator.text(`${ Math.round(speed) }WPM`);
    }

    $('body').css({'font-family': 'monospace'});

    const keypressHandler = (() => {
        const letters = 'abcdefghijklmnopqrstuvwxyz'.split(''),
              numbers = '1234567890'.split(''),
              special = ' `~!@#$%^&*()-_=+{}[]\\|;:\'"<>,./?'.split(''),
              checkIfCharIsTypable = c => !! [letters, numbers, special].find(charset => charset.includes(c));

        return function keypressHandler(e) {
            e.preventDefault();
            // console.log('pressed', e.key, e.code);

            if (! timer.isRunning)
                return;

            if (currCharIndex >= words.length)
                return;
            
            let isTypable = checkIfCharIsTypable(e.key.toLowerCase()),
                isBackspace = e.key.toLowerCase() == 'backspace';

            if (! isTypable && !isBackspace)
                return;

            if (isTypable) {
                let currChar = words[currCharIndex];
                if (e.key == currChar) {
                    $typed.append(`<span class="text-success">${ currChar }</span>`);
                } else {
                    $typed.append(`<span class="text-danger">${ e.key }</span>`);
                    mistakesCount++;
                }
                typed += e.key;
                currCharIndex++;
            } else if (isBackspace) {
                typed = typed.slice(0, -1);
                $typed.children().eq(-1).remove();
                currCharIndex--;
            }

            renderUntyped();
            updateTypingSpeed();

            if (currCharIndex >= words.length) {
                finishTypingSession();
            }
        };
    })();
    document.addEventListener('keydown', keypressHandler);

    function startTypingSession() {
        currCharIndex = 0;
        $typed.text('');
        renderUntyped();
        $startBtn
            .css('display', 'none')
            .blur();
        $retryBtn.css('display', 'none');
        timer.start();
    }

    function finishTypingSession() {
        setTimeout(() => {
            timer.stop();
            alert('finished!');
            alert(`You used ${ timer.runTime / 1000 }s`);
            alert(`Your typing speed was used ${ calculateTypingSpeed() }s`);
            console.log('mistakes', mistakesCount);
            $retryBtn.css('display', '');
        }, 150);
    }
})();




})();
