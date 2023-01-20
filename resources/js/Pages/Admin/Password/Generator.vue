<template>
  <div class="card">
    <div class="card-title text-center">
      <span class="password-preview" v-if="passwordType=== 'password'" @click="copyToClipboard">
        {{ generatedPassword ? generatedPassword : 'Generated Password' }}
      </span>
      <span class="password-preview" v-if="passwordType=== 'passphrase'" @click="copyToClipboard">
        {{ generatedPassPhrase ? generatedPassPhrase : 'Generated Passphrase' }}
      </span>
    </div>
    <div class="card-body">
      <div class="card-body">
        <div class="row mb-3">
          <div class="col-lg-12 col-md-4">
            <b>What would you like to generate?</b>
          </div>
          <div class="col-lg-12 col-md-8">
            <RadioInput
              class="options"
              v-for="(type, index) in generationTypes"
              :key="'type' + index"
              v-model="generationType"
              name="generatorType"
              :value="type.value"
              :label="type.label"/>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-lg-12 col-md-4 label ">
            <b>Password Type</b>
          </div>
          <div class="col-lg-12 col-md-8">
            <RadioInput
              v-for="(type, index) in types"
              name="type"
              v-model="passwordType"
              :key="'type' + index"
              :value="type.value"
              :label="type.label"/>
          </div>
        </div>
        <div class="row mb-3" v-if="passwordType === 'password'">
          <div class="col-lg-4 col-md-4">
            <Input
              type="number"
              min="1"
              v-model="generator.length"
              label="Length"
              placeholder="Length"
            />
          </div>
          <div class="col-lg-4 col-md-4">
            <Input
              type="number"
              max="9"
              min="1"
              v-model="generator.minimumNumber"
              label="Minimum Number"
              placeholder="Minimum Number"
            />
          </div>
          <div class="col-lg-4 col-md-4">
            <Input
              type="number"
              max="9"
              min="1"
              v-model="generator.minimumSpecialCharacter"
              label="Minimum Special"
              placeholder="Minimum special"
            />
          </div>
        </div>
        <div class="row mb-3" v-if="passwordType === 'password'">
          <div class="col-lg-12 col-md-12">
            <b>Options</b>
          </div>
          <div class="col-lg-12 col-md-12">
            <Checkbox
              v-model="generator.options.uppercase"
              :label="passwordOptions.uppercase.label"
              :value="passwordOptions.uppercase.value"
            />
            <Checkbox
              v-model="generator.options.numbers"
              :label="passwordOptions.numbers.label"
              :value="passwordOptions.numbers.value"
            />
            <Checkbox
              v-model="generator.options.special"
              :label="passwordOptions.special.label"
              :value="passwordOptions.special.value"
            />
            <Checkbox
              v-model="generator.options.ambiguous"
              :label="passwordOptions.ambiguous.label"
              :value="passwordOptions.ambiguous.value"
            />
          </div>
          <div class="col-lg-12">
            <Button
              @click.prevent="generatePassword"
              type="button"
              size="sm"
              text="Regenerate Password"
              color="primary"
            />
            <Button
              @click.prevent="copyToClipboard"
              type="button"
              class="m-lg-2"
              size="sm"
              text="Copy Password"
              color="secondary"
            />
          </div>
        </div>
        <div class="row mb-3" v-if="passwordType === 'passphrase'">
          <div class="col-lg-4 col-md-4">
            <Input
              type="number"
              min="4"
              v-model="passPhraseGenerator.numberOfWords"
              label="Number of Word"
              placeholder="Number of Word"
            />
          </div>
          <div class="col-lg-4 col-md-4">
            <Input
              type="text"
              v-model="passPhraseGenerator.wordSeparator"
              label="Separator"
              placeholder="Separator"
            />
          </div>
        </div>
        <div class="row mb-3" v-if="passwordType === 'passphrase'">
          <div class="col-lg-12 col-md-12">
            <b>Options</b>
          </div>
          <div class="col-lg-12 col-md-12">
            <Checkbox
              v-model="passPhraseGenerator.capitalize"
              label="Capitalize"
            />
            <Checkbox
              v-model="passPhraseGenerator.isIncludeNumber"
              label="Include number"
            />
          </div>
          <div class="col-lg-12">
            <Button
              @click.prevent="generatePassphrase"
              type="button"
              size="sm"
              text="Regenerate Password"
              color="primary"
            />
            <Button
              @click.prevent="copyToClipboard"
              type="button"
              class="m-lg-2"
              size="sm"
              text="Copy Password"
              color="secondary"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {reactive, toRefs, onMounted, watch} from 'vue';
import {useHelper, useNotify} from '@/Composables/composable';
import {CHARACTER_SET, POSSIBLE_CHARACTER_SET, WORD_LIST} from '@/util/consts';
import RadioInput from '@/Components/RadioInput';
import Input from '@/Components/Input';
import Checkbox from '@/Components/Checkbox';
import Button from '@/Components/Button';

export default {
  name: 'Generator',
  components: { RadioInput, Input, Checkbox, Button },
  setup(props) {
    const { setPageTitle, route } = useHelper();
    const { notifySuccess, notifyWarning } = useNotify();

    const state = reactive({
      generationType: 'password',
      passwordType: 'password',
      generator: {
        length: 14,
        minimumNumber: 1,
        minimumSpecialCharacter: 1,
        options: {
          uppercase: true,
          numbers: true,
          special: true,
          ambiguous: true
        }
      },
      passPhraseGenerator: {
        numberOfWords: 4,
        wordSeparator: '-',
        capitalize: false,
        isIncludeNumber: false
      },
      generationTypes: [
        {
          value: 'password',
          label: 'Password'
        }
      ],
      types: [
        {
          value: 'password',
          label: 'Password'
        },
        {
          value: 'passphrase',
          label: 'Passphrase'
        },
      ],
      passwordOptions: {
        uppercase: {
          label: 'A-Z',
          value: true,
        },
        numbers: {
          label: '0-9',
          value: true,
        },
        special: {
          label: '!@#$%^&*',
          value: true,
        },
        ambiguous: {
          label: 'Avoid ambiguous characters',
          value: true,
        },
      },
      generatedPassword: null,
      generatedPassPhrase: null,
    });

    setPageTitle('Generator');

    const generatePassword = () => {
      let generatedPassword = '';

      let numberOfSpecialChar = 0;
      let numberOfNumericChar = 0;

      let options = state.generator.options;
      while (generatedPassword.length < state.generator.length) {
        let randomIndex = Math.floor(Math.random() * POSSIBLE_CHARACTER_SET.length);
        let characters = POSSIBLE_CHARACTER_SET.charAt(randomIndex);

        if (options.numbers) {
          characters = Math.random() > 0.5 ? characters + Math.floor(Math.random() * 10) : characters;
          if (!isNaN(parseInt(characters))) {
            numberOfNumericChar++;
          }
        }

        if (options.uppercase) {
          characters = Math.random() > 0.5 ? characters.toUpperCase() : characters;
        }

        if (options.special) {
          if (options.special && CHARACTER_SET.symbol.indexOf(characters) !== -1) {
            numberOfSpecialChar++;
          }
        }

        if (!options.ambiguous) {
          characters = "{}[]()/\"'`<>,;:.?\\|"
        }

        if (options.special && numberOfSpecialChar < state.generator.minimumSpecialCharacter) {
          let diff = state.generator.minimumSpecialCharacter - numberOfSpecialChar;
          for (let i = 0; i < diff; i++) {
            let randomSpecialCharIndex = Math.floor(Math.random() * CHARACTER_SET.symbol.length);
            generatedPassword = generatedPassword
              .slice(0, randomSpecialCharIndex) + CHARACTER_SET.symbol
              .charAt(randomSpecialCharIndex) + generatedPassword
              .slice(randomSpecialCharIndex);
          }
        }

        if (options.numbers && numberOfNumericChar < state.generator.minimumNumber) {
          let diff = state.generator.minimumNumber - numberOfNumericChar;
          for (let i = 0; i < diff; i++) {
            let randomNumberIndex = Math.floor(Math.random() * (generatedPassword.length - 1));
            let randomNumber = Math.floor(Math.random() * 10);
            generatedPassword = generatedPassword
              .slice(0, randomNumberIndex) + randomNumber + generatedPassword
              .slice(randomNumberIndex);
          }
        }

        generatedPassword += characters;
      }

      state.generatedPassword = generatedPassword;
    };

    const generatePassphrase = () => {
      let generatedPassword = '';

      let options = state.passPhraseGenerator;

      for (let i = 0; i < options.numberOfWords; i++) {
        let word = options.capitalize
          ? WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].charAt(0).toUpperCase() + WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].slice(1) :
          WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].charAt(0).toLowerCase() + WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)].slice(1);

        generatedPassword += word;

        if (i < options.numberOfWords - 1) {
          generatedPassword += options.wordSeparator;
        }
      }

      if (options.isIncludeNumber) {
        const splittedPhrase = generatedPassword.split(options.wordSeparator);

        const randomIndex = Math.floor(Math.random() * splittedPhrase.length);

        const randomNum = Math.floor(Math.random() * 10);

        splittedPhrase[randomIndex] = splittedPhrase[randomIndex] + randomNum;

        generatedPassword = splittedPhrase.join(options.wordSeparator);
      }

      state.generatedPassPhrase = generatedPassword;

    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(state.passwordType === 'password' ? state.generatedPassword : state.generatedPassPhrase);
        notifySuccess('Password copied to clipboard')
      } catch (err) {
        notifyWarning('Failed to copy text: ', err)
      }
    };

    watch(state.generator, () => {
      if (state.passwordType === 'password') {
        generatePassword();
      }
    });

    watch(state.passPhraseGenerator, () => {
      if (state.passwordType === 'passphrase') {
        generatePassphrase();
      }
    });

    onMounted(() => {
      generatePassword();
      generatePassphrase();
    })

    return {
      ...toRefs(state),
      generatePassword,
      generatePassphrase,
      copyToClipboard
    }
  }
};
</script>

<style scoped lang="scss">
.form-check {
  display: inline-block;
  margin-right: 10px;
  font-size: 12px;
}
.checkbox {
  display: block;
}
.form-label {
  font-weight: 600;
}
.card-title {
  border: 1px solid #c9baba87;
}
span.password-preview {
  font-size: 19px;
  cursor: auto;
}
</style>
