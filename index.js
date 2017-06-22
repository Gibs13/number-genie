module.change_code = 1;
'use strict';

var alexa = require( 'alexa-app' );
var app = new alexa.app( 'number-genie' );

let sprintf = require('sprintf-js').sprintf;

function getRandomNumber (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const MIN = 0;
const MAX = 100;
const STEAM_SOUND_GAP = 5;
const GAME_CONTEXT = 'game';
const GENERATE_ANSWER_ACTION = 'generate_answer';
const CHECK_GUESS_ACTION = 'check_guess';
const QUIT_ACTION = 'quit';
const PLAY_AGAIN_YES_ACTION = 'play_again_yes';
const PLAY_AGAIN_NO_ACTION = 'play_again_no';
const DEFAULT_FALLBACK_ACTION = 'input.unknown';
const UNKNOWN_DEEPLINK_ACTION = 'deeplink.unknown';
const NUMBER_DEEPLINK_ACTION = 'deeplink.number';
const NUMBER_ARGUMENT = 'number';
const YES_NO_CONTEXT = 'yes_no';
const DONE_YES_NO_CONTEXT = 'done_yes_no';
const DONE_YES_ACTION = 'done_yes';
const DONE_NO_ACTION = 'done_no';
const GUESS_ARGUMENT = 'guess';
const REPEAT_ACTION = 'repeat';

const HIGHER_HINT = 'higher';
const LOWER_HINT = 'lower';
const NO_HINT = 'none';

const SSML_SPEAK_START = '<speak>';
const SSML_SPEAK_END = '</speak>';

const COLD_WIND_AUDIO = '<audio src="./audio/NumberGenieEarcon_ColdWind.wav"/>';
const STEAM_ONLY_AUDIO = '<audio src="./audio/NumberGenieEarcon_SteamOnly.wav"/>';
const STEAM_AUDIO = '<audio src="./audio/NumberGenieEarcons_Steam.wav"/>';
const YOU_WIN_AUDIO = '<audio src="./audio/NumberGenieEarcons_YouWin.wav"/>';

const ANOTHER_GUESS_PROMPTS = ['What\'s your next guess?', 'Have another guess?', 'Try another.'];
const LOW_PROMPTS = ['It\'s lower than %s.'];
const HIGH_PROMPTS = ['It\'s higher than %s.'];
const LOW_CLOSE_PROMPTS = ['It\'s so close, but not quite!'];
const HIGH_CLOSE_PROMPTS = ['It\'s so close, but not quite!'];
const LOWER_PROMPTS = ['You\'re getting warm.  It\'s lower than %s. Have another guess?',
    'Warmer. Take another guess that\'s lower than %s.', 'It\'s so close, but it\'s lower than %s.'];
const HIGHER_PROMPTS = ['You\'re getting warm. It\'s higher than %s. Have another guess?',
    'Warmer. It\'s also higher than %s. Take another guess.', 'It\'s so close, but it\'s higher than %s.'];
const LOWEST_PROMPTS = ['You\'re piping hot! But it\'s still lower.',
    'You\'re hot as lava! Go lower.', 'Almost there! A bit lower.'];
const HIGHEST_PROMPTS = ['You\'re piping hot! But it\'s still higher.',
    'You\'re hot as lava! Go higher.', 'Almost there! A bit higher.'];

const CORRECT_GUESS_PROMPTS = ['Well done! It is indeed %s.', 'Congratulations, that\'s it! I was thinking of %s.',
    'You got it! It\'s %s.' ];
const PLAY_AGAIN_QUESTION_PROMPTS = ['Wanna play again?', 'Want to try again?', 'Hey, should we do that again?'];

const QUIT_REVEAL_PROMPTS = ['Ok, I was thinking of %s.', 'Sure, I\'ll tell you the number anyway. It was %s.'];
const QUIT_REVEAL_BYE = ['See you later.', 'Talk to you later.'];
const QUIT_PROMPTS = ['Alright, talk to you later then.', 'OK, till next time.',
    'See you later.', 'OK, I\'m already thinking of a number for next time.'];

const GREETING_PROMPTS = ['Let\'s play Number Genie!', 'Welcome to Number Genie!', 'Hi! This is Number Genie.',
    'Welcome back to Number Genie.'];
const INVOCATION_PROMPT = ['I\'m thinking of a number from %s to %s. What\'s your first guess?'];
const RE_PROMPT = ['Great!', 'Awesome!', 'Cool!', 'Okay, let\'s play again.', 'Okay, here we go again.',
    'Alright, one more time with feeling.'];
const RE_INVOCATION_PROMPT = ['I\'m thinking of a new number from %s to %s. What\'s your guess?'];

const WRONG_DIRECTION_LOWER_PROMPTS = ['Clever, but no. It\'s still lower than %s.',
    'Nice try, but it\'s still lower than %s.'];
const WRONG_DIRECTION_HIGHER_PROMPTS = ['Clever, but no. It\'s still higher than %s.',
    'Nice try, but it\'s still higher than %s.'];

const REALLY_COLD_LOW_PROMPTS = ['You\'re ice cold. It\'s way lower than %s.',
    'You\'re freezing cold. It\'s a lot lower than %s.'];
const REALLY_COLD_HIGH_PROMPTS = ['You\'re ice cold. It’s way higher than %s.',
    'You\'re freezing cold. It\'s a lot higher than %s.'];
const REALLY_HOT_LOW_PROMPTS_1 = ['Almost there.', 'Very close.'];
const REALLY_HOT_LOW_PROMPTS_2 = ['Keep going.', 'It\'s so close, you\'re almost there.'];
const REALLY_HOT_HIGH_PROMPTS_1 = ['Almost there.', 'It\'s so close.'];
const REALLY_HOT_HIGH_PROMPTS_2 = ['Keep going.', 'Very close, you\'re almost there.'];

const SAME_GUESS_PROMPTS_1 = ['It\'s still not %s. Guess %s.'];
const SAME_GUESS_PROMPTS_2 = ['Maybe it\'ll be %s the next time. Let’s play again soon.'];
const SAME_GUESS_PROMPTS_3 = ['It\'s still not %s. Guess again.'];

const MIN_PROMPTS = ['I see what you did there. But no, it\'s higher than %s.'];
const MAX_PROMPTS = ['Oh, good strategy. Start at the top. But no, it’s lower than %s.'];

const MANY_TRIES_PROMPTS = ['Yes! It\'s %s. Nice job!  How about one more round?'];

const FALLBACK_PROMPT_1 = ['Are you done playing Number Genie?'];
const FALLBACK_PROMPT_2 = ['Since I\'m still having trouble, I\'ll stop here. Let’s play again soon.'];

const DEEPLINK_PROMPT_1 = ['%s has %s letters. The number I\'m thinking of is higher. Have another guess?',
    '%s is a great guess. It has %s letters, but I\'m thinking of a higher number. What\'s your next guess?'];
const DEEPLINK_PROMPT_2 = ['%s has %s letters. The number I\'m thinking of is lower. Have another guess?',
    '%s is a great first guess. It has %s letters, but the number I\'m thinking of is lower. Guess again!'];
const DEEPLINK_PROMPT_3 = ['Wow! You\'re a true Number Genie! %s has %s letters and the number I was thinking of was %s! Well done!',
    'Amazing! You\'re a real Number Genie! %s has %s letters and the number I was thinking of was %s. Great job!'];

const NO_INPUT_PROMPTS = ['I didn\'t hear a number', 'If you\'re still there, what\'s your guess?',
    'We can stop here. Let\'s play again soon.'];

const REPEAT_PROMPTS = ['Sure. %s.', 'OK. %s.'];

const IMAGE_BASE_URL = './images/';

const IMAGE = {
  COLD: { url: IMAGE_BASE_URL + 'COLD.gif', altText: 'cold genie', description: 'You\'re really far off!'},
  COOL: { url: IMAGE_BASE_URL + 'COOL.gif', altText: 'cool genie', description: 'Try again!'},
  HOT: { url: IMAGE_BASE_URL + 'HOT.gif', altText: 'hot genie', description: 'You\'re so close!'},
  INTRO: { url: IMAGE_BASE_URL + 'INTRO.gif', altText: 'Mystical crystal ball', description: 'Welcome to Number Genie!'},
  WARM: { url: IMAGE_BASE_URL + 'WARM.gif', altText: 'warm genie', description: 'You\'re getting closer!'},
  WIN: { url: IMAGE_BASE_URL + 'WIN.gif', altText: 'celebrating genie', description: '🎉 Congratulations! 🎉'}
};

// Utility function to pick prompts
function getRandomPrompt (array) {
  let lastPrompt = app.request.response.session('lastPrompt');
  let prompt;
  if (lastPrompt) {
    for (let index in array) {
      prompt = array[index];
      if (prompt != lastPrompt) {
        break;
      }
    }
  } else {
    prompt = array[Math.floor(Math.random() * (array.length))];
  }
  return prompt;
}

app.intent(GENERATE_ANSWER_ACTION,
  function generateAnswer (request,response) {
    console.log('generateAnswer');
    let answer = getRandomNumber(MIN, MAX);
    response.session('answer',answer);
    response.session('guessCount',0);
    response.session('fallbackCount',0);
    response.session('steamSoundCount',0);

    let title = getRandomPrompt(GREETING_PROMPTS);
    let prompt = printf(title + ' ' +
      getRandomPrompt(INVOCATION_PROMPT), MIN, MAX);
      let basicCard = { 'type': 'Standard','title': IMAGE.INTRO.description, 'image': {'largeImageUrl': IMAGE.INTRO.url}, 'text':IMAGE.INTRO.altText };
      ask(response, prompt, 1, basicCard);
    });

app.intent(CHECK_GUESS_ACTION,
  function checkGuess (request,response) {
    console.log('checkGuess');
    let answer = response.session('answer');
    let guess = parseInt(assistant.getArgument(GUESS_ARGUMENT));
    let diff = Math.abs(guess - answer);
    response.session('guessCount')++;
    response.session('fallbackCount',0);
    // Check for duplicate guesses
    if (response.session('previousGuess') && guess === response.session('previousGuess')) {
      response.session('duplicateCount')++;
      if (response.session('duplicateCount') === 1) {
        if (!response.session('hint') || response.session('hint') === NO_HINT) {
          ask(response, printf(getRandomPrompt(assistant, SAME_GUESS_PROMPTS_3), guess));
        } else {
          ask(response, printf(getRandomPrompt(assistant, SAME_GUESS_PROMPTS_1), guess, response.session('hint')));
        }
        return;
      } else if (response.session('duplicateCount') === 2) {
        assistant.tell(printf(getRandomPrompt(assistant, SAME_GUESS_PROMPTS_2), guess));
        return;
      }
    }
    response.session('duplicateCount',0);
    // Check if user isn't following hints
    if (response.session('hint')) {
      if (response.session('hint') === HIGHER_HINT && guess <= response.session('previousGuess')) {
        let prompt = printf(getRandomPrompt(assistant, WRONG_DIRECTION_HIGHER_PROMPTS), response.session('previousGuess'));
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.COOL.description)
            .setImage(IMAGE.COOL.url, IMAGE.COOL.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      } else if (response.session('hint') === LOWER_HINT && guess >= response.session('previousGuess')) {
        let prompt = printf(getRandomPrompt(assistant, WRONG_DIRECTION_LOWER_PROMPTS), response.session('previousGuess'));
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.COOL.description)
            .setImage(IMAGE.COOL.url, IMAGE.COOL.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      }
    }
    // Handle boundaries with special prompts
    if (answer !== guess) {
      if (guess === MIN) {
        response.session('hint = HIGHER_HINT');
        response.session('previousGuess = guess');
        ask(response, printf(getRandomPrompt(assistant, MIN_PROMPTS), MIN));
        return;
      } else if (guess === MAX) {
        response.session('hint = LOWER_HINT');
        response.session('previousGuess',guess);
        ask(response, printf(getRandomPrompt(assistant, MAX_PROMPTS), MAX));
        return;
      }
    }
    // Give different responses based on distance from number
    if (diff > 75) {
      // Guess is far away from number
      if (answer > guess) {
        response.session('hint',HIGHER_HINT);
        response.session('previousGuess',guess);
        let prompt = SSML_SPEAK_START + COLD_WIND_AUDIO +
          printf(getRandomPrompt(assistant, REALLY_COLD_HIGH_PROMPTS), guess) +
          SSML_SPEAK_END;
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.COLD.description)
            .setImage(IMAGE.COLD.url, IMAGE.COLD.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      } else if (answer < guess) {
        response.session('hint',LOWER_HINT);
        response.session('previousGuess',guess);
        let prompt = SSML_SPEAK_START + COLD_WIND_AUDIO +
          printf(getRandomPrompt(assistant, REALLY_COLD_LOW_PROMPTS), guess) +
          SSML_SPEAK_END;
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.COLD.description)
            .setImage(IMAGE.COLD.url, IMAGE.COLD.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      }
    } else if (diff === 4) {
      // Guess is getting closer
      if (answer > guess) {
        response.session('hint',NO_HINT);
        response.session('previousGuess',guess);
        let prompt = getRandomPrompt(assistant, HIGH_CLOSE_PROMPTS);
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
            .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      } else if (answer < guess) {
        response.session('hint',NO_HINT);
        response.session('previousGuess',guess);
        let prompt = getRandomPrompt(assistant, LOW_CLOSE_PROMPTS);
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
            .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      }
    } else if (diff === 3) {
      // Guess is even closer
      if (answer > guess) {
        response.session('hint',HIGHER_HINT);
        response.session('previousGuess',guess);
        if (response.session('steamSoundCount')-- <= 0) {
          response.session('steamSoundCount',STEAM_SOUND_GAP);
          let prompt = SSML_SPEAK_START + STEAM_ONLY_AUDIO +
            printf(getRandomPrompt(assistant, HIGHEST_PROMPTS)) + SSML_SPEAK_END;
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }
        } else {
          let prompt = getRandomPrompt(assistant, HIGHEST_PROMPTS);
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }
        }
        return;
      } else if (answer < guess) {
        response.session('hint',LOWER_HINT);
        response.session('previousGuess',guess);
        if (response.session('steamSoundCount')-- <= 0) {
          response.session('steamSoundCount',STEAM_SOUND_GAP);
          let prompt = SSML_SPEAK_START + STEAM_ONLY_AUDIO +
            printf(getRandomPrompt(assistant, LOWEST_PROMPTS)) + SSML_SPEAK_END;
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }
        } else {
          let prompt = getRandomPrompt(assistant, LOWEST_PROMPTS);
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }
        }
        return;
      }
    } else if (diff <= 10 && diff > 4) {
      // Guess is nearby number
      if (answer > guess) {
        response.session('hint',HIGHER_HINT);
        response.session('previousGuess',guess);
        let prompt = printf(getRandomPrompt(assistant, HIGHER_PROMPTS), guess);
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.WARM.description)
            .setImage(IMAGE.WARM.url, IMAGE.WARM.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      } else if (answer < guess) {
        response.session('hint',LOWER_HINT);
        response.session('previousGuess',guess);
        let prompt = printf(getRandomPrompt(assistant, LOWER_PROMPTS), guess);
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.WARM.description)
            .setImage(IMAGE.WARM.url, IMAGE.WARM.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      }
    }
    // Give hints on which direction to go
    if (answer > guess) {
      let previousHint = response.session('hint');
      response.session('hint = HIGHER_HINT');
      response.session('previousGuess',guess);
      if (previousHint && previousHint === HIGHER_HINT && diff <= 2) {
        // Very close to number
        if (response.session('steamSoundCount')-- <= 0) {
          response.session('steamSoundCount') = STEAM_SOUND_GAP;
          let prompt = SSML_SPEAK_START + STEAM_AUDIO +
            printf(getRandomPrompt(assistant, REALLY_HOT_HIGH_PROMPTS_2)) +
            SSML_SPEAK_END;
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }

        } else {
          if (diff <= 1) {
            let prompt = getRandomPrompt(assistant, REALLY_HOT_HIGH_PROMPTS_1);
            if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
              let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
                .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
              let richResponse = assistant.buildRichResponse()
                .addSimpleResponse(prompt)
                .addBasicCard(basicCard);
              ask(response, richResponse);
            } else {
              ask(response, prompt);
            }
          } else {
            let prompt = getRandomPrompt(assistant, REALLY_HOT_HIGH_PROMPTS_2);
            if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
              let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
                .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
              let richResponse = assistant.buildRichResponse()
                .addSimpleResponse(prompt)
                .addBasicCard(basicCard);
              ask(response, richResponse);
            } else {
              ask(response, prompt);
            }
          }
        }
        return;
      } else {
        ask(response, printf(getRandomPrompt(assistant, HIGH_PROMPTS) + ' ' +
          getRandomPrompt(assistant, ANOTHER_GUESS_PROMPTS), guess));
        return;
      }
    } else if (answer < guess) {
      let previousHint = response.session('hint');
      response.session('hint',LOWER_HINT);
      response.session('previousGuess',guess);
      if (previousHint && previousHint === LOWER_HINT && diff <= 2) {
        // Very close to number
        if (response.session('steamSoundCount')-- <= 0) {
          response.session('steamSoundCount',STEAM_SOUND_GAP);
          let prompt = SML_SPEAK_START + STEAM_AUDIO +
            printf(getRandomPrompt(assistant, REALLY_HOT_LOW_PROMPTS_2)) + SSML_SPEAK_END;
          if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
            let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
              .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
            let richResponse = assistant.buildRichResponse()
              .addSimpleResponse(prompt)
              .addBasicCard(basicCard);
            ask(response, richResponse);
          } else {
            ask(response, prompt);
          }
        } else {
          if (diff <= 1) {
            let prompt = getRandomPrompt(assistant, REALLY_HOT_LOW_PROMPTS_1);
            if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
              let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
                .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
              let richResponse = assistant.buildRichResponse()
                .addSimpleResponse(prompt)
                .addBasicCard(basicCard);
              ask(response, richResponse);
            } else {
              ask(response, prompt);
            }
          } else {
            let prompt = getRandomPrompt(assistant, REALLY_HOT_LOW_PROMPTS_2);
            if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
              let basicCard = assistant.buildBasicCard(IMAGE.HOT.description)
                .setImage(IMAGE.HOT.url, IMAGE.HOT.altText);
              let richResponse = assistant.buildRichResponse()
                .addSimpleResponse(prompt)
                .addBasicCard(basicCard);
              ask(response, richResponse);
            } else {
              ask(response, prompt);
            }
          }
        }
        return;
      } else {
        ask(response, printf(getRandomPrompt(assistant, LOW_PROMPTS) + ' ' +
          getRandomPrompt(assistant, ANOTHER_GUESS_PROMPTS), guess));
        return;
      }
    } else {
      // Guess is same as number
      let guessCount = response.session('guessCount');
      response.session('hint',NO_HINT);
      response.session('previousGuess',-1);
      assistant.setContext(YES_NO_CONTEXT);
      response.session('guessCount',0);
      if (guessCount >= 10) {
        let prompt = SSML_SPEAK_START + YOU_WIN_AUDIO +
          printf(getRandomPrompt(assistant, MANY_TRIES_PROMPTS), answer) +
          SSML_SPEAK_END;
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.WIN.description)
            .setImage(IMAGE.WIN.url, IMAGE.WIN.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      } else {
        let prompt = SSML_SPEAK_START + YOU_WIN_AUDIO + 
          printf(getRandomPrompt(assistant, CORRECT_GUESS_PROMPTS) + ' ' +
          getRandomPrompt(assistant, PLAY_AGAIN_QUESTION_PROMPTS), answer) +
          SSML_SPEAK_END;
        if (assistant.hasSurfaceCapability(assistant.SurfaceCapabilities.SCREEN_OUTPUT)) {
          let basicCard = assistant.buildBasicCard(IMAGE.WIN.description)
            .setImage(IMAGE.WIN.url, IMAGE.WIN.altText);
          let richResponse = assistant.buildRichResponse()
            .addSimpleResponse(prompt)
            .addBasicCard(basicCard);
          ask(response, richResponse);
        } else {
          ask(response, prompt);
        }
        return;
      }
    }
  });

app.intent(QUIT_ACTION,
  function quit (request,response) {
    console.log('quit');
    let answer = response.session('answer');
    assistant.tell(printf(getRandomPrompt(assistant, QUIT_REVEAL_PROMPTS) + ' '
      + getRandomPrompt(assistant, QUIT_REVEAL_BYE), answer));
  });

app.intent(PLAY_AGAIN_YES_ACTION,
  function playAgainYes (request,response) {
    console.log('playAgainYes');
    let answer = getRandomNumber(MIN, MAX);
    response.session('answer',answer);
    response.session('guessCount',0);
    response.session('fallbackCount',0);
    response.session('steamSoundCount',0);
    ask(response, printf(getRandomPrompt(assistant, RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, RE_INVOCATION_PROMPT), MIN, MAX));
  });

app.intent(PLAY_AGAIN_NO_ACTION,
  function playAgainNo (request,response) {
    console.log('playAgainNo');
    assistant.setContext(GAME_CONTEXT, 1);
    assistant.tell(printf(getRandomPrompt(assistant, QUIT_PROMPTS)));
  });

app.intent(DEFAULT_FALLBACK_ACTION,
  function defaultFallback (request,response) {
    console.log('defaultFallback: ' + response.session('fallbackCount'));
    if (response.session('fallbackCount') === undefined) {
      response.session('fallbackCount',0);
    }
    response.session('fallbackCount')++;
    // Provide two prompts before ending game
    if (response.session('fallbackCount') === 1) {
      assistant.setContext(DONE_YES_NO_CONTEXT);
      ask(response, printf(getRandomPrompt(assistant, FALLBACK_PROMPT_1)));
    } else {
      assistant.tell(printf(getRandomPrompt(assistant, FALLBACK_PROMPT_2)));
    }
  });

app.intent(UNKNOWN_DEEPLINK_ACTION,
  function unhandledDeeplinks (request,response) {
    console.log('unhandledDeeplinks');
    let answer = getRandomNumber(MIN, MAX);
    response.session('answer',answer);
    response.session('guessCount',0);
    response.session('fallbackCount',0);
    response.session('steamSoundCount',0);
    assistant.setContext(GAME_CONTEXT, 1);
    let text = assistant.getArgument(RAW_TEXT_ARGUMENT);

    if (text) {
      if (isNaN(text)) {
        // Handle "talk to number genie about frogs" by counting
        // number of letters in the word as the guessed number
        let numberOfLetters = text.length;
        if (numberOfLetters < answer) {
          ask(response, getRandomPrompt(assistant, GREETING_PROMPTS) + ' ' +
            printf(getRandomPrompt(assistant, DEEPLINK_PROMPT_1), text.toUpperCase(), numberOfLetters, numberOfLetters));
        } else if (numberOfLetters > answer) {
          ask(response, getRandomPrompt(assistant, GREETING_PROMPTS) + ' ' +
            printf(getRandomPrompt(assistant, DEEPLINK_PROMPT_2), text.toUpperCase(), numberOfLetters, numberOfLetters));
        } else {
          response.session('hint',NO_HINT);
          response.session('previousGuess',-1);
          assistant.setContext(YES_NO_CONTEXT);
          ask(response, SSML_SPEAK_START + YOU_WIN_AUDIO +
            printf(getRandomPrompt(assistant, DEEPLINK_PROMPT_3) + ' ' +
            getRandomPrompt(assistant, PLAY_AGAIN_QUESTION_PROMPTS), text.toUpperCase(), numberOfLetters, answer) + SSML_SPEAK_END);
        }
      } else {
        // Easter egg to set the answer for demos
        // Handle "talk to number genie about 55"
        response.session('answer',parseInt(text));
        assistant.ask(printf(getRandomPrompt(assistant, GREETING_PROMPTS) + ' ' +
          getRandomPrompt(assistant, INVOCATION_PROMPT), MIN, MAX));
      }
    } else {
      defaultFallback(assistant);
    }
  });

app.intent(NUMBER_DEEPLINK_ACTION,
  function numberDeeplinks (request,response) {
    console.log('numberDeeplinks');
    response.session('guessCount',0);
    response.session('fallbackCount',0);
    response.session('steamSoundCount',0);
    assistant.setContext(GAME_CONTEXT, 1);
    let number = parseInt(assistant.getArgument(NUMBER_ARGUMENT));
    // Easter egg to set the answer for demos
    // Handle "talk to number genie about 55"
    response.session('answer',number);
    assistant.ask(printf(getRandomPrompt(assistant, GREETING_PROMPTS) + ' ' +
      getRandomPrompt(assistant, INVOCATION_PROMPT), MIN, MAX));
  });

app.intent(DONE_YES_ACTION,
  function doneYes (request,response) {
    console.log('doneYes');
    assistant.setContext(GAME_CONTEXT, 1);
    assistant.tell(printf(getRandomPrompt(assistant, QUIT_PROMPTS)));
  });

app.intent(DONE_NO_ACTION,
  function doneNo (request,response) {
    console.log('doneNo');
    response.session('fallbackCount',0);
    ask(response, printf(getRandomPrompt(assistant, RE_PROMPT) + ' ' +
      getRandomPrompt(assistant, ANOTHER_GUESS_PROMPTS)));
  });

app.intent(REPEAT_ACTION,
  function repeat (request,response) {
    console.log('repeat');
    let lastPrompt = printf(response.session('printed'));
    if (lastPrompt) {
      ask(response, printf(getRandomPrompt(assistant, REPEAT_PROMPTS), lastPrompt), false);
    } else {
      ask(response, printf(getRandomPrompt(assistant, ANOTHER_GUESS_PROMPTS)), false);
    }
  });

  function doPersist (persist) {
    if (persist === undefined || persist) {
      response.session('lastPrompt',response.session('previous'));
    }
  }

  function ask (response, prompt, persist) {
    console.log('ask: ' + prompt);
    doPersist(persist);
    response.say(prompt).reprompt(NO_INPUT_PROMPTS).card(arguments[3]);
  }

  function printf(prompt) {
    console.log('printf: ' + sprintf.apply(this, arguments));
    response.session('previous') = prompt;
    response.session('printed') = sprintf.apply(this, arguments);
    return sprintf.apply(this, arguments);
  }

module.exports = app;