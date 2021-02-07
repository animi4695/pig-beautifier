import { Component, TemplateRef, OnInit } from '@angular/core';
import { Global } from 'src/app/global';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'

declare const vkbeautify : any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'pig-beautifier';
  langOptions: any[];
  modalRef: BsModalRef;

  options: any;
  global: Global;
  codeOptions: any;
  code: string;
  languageDefaults: any;
  defaultOptions: any;
  sqlOptions: any;
  selectedLanguageType: string;
  codeChanged: boolean;
  constructor(global: Global, private modalService: BsModalService) {
    this.global = global;
    this.codeOptions = {
      lineNumbers: true,
      theme: 'dark',
      mode: 'javascript'
    };
  }

  ngOnInit() {
    this.langOptions = [
      { name: "HTML" },
      { name: "CSS" },
      { name: "JS" },
      { name: "SQL" },
      { name: "JSON" },
      { name: "XML" }
    ];
    this.codeOptions = {
      lineNumbers: true,
      theme: 'default',
      mode: 'javascript'
    };
    this.setOptions();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  beautify = () => { 
    if (this.selectedLanguageType === 'sql') {
      if (this.sqlOptions['upperCase']) {
        this.code = this.toUpperCaseQuoted(this.code);
      }
      const indent = '\xa0';
      this.sqlOptions['indent'] = indent.repeat(this.sqlOptions['indentation']);
      this.code = this.global.sqlFormatter(this.code, this.sqlOptions);
    } else if (this.selectedLanguageType === 'json') {
      this.code = this.global.beautify['js'](this.code, this.options);
    } else if(this.selectedLanguageType == 'xml'){
      this.code = vkbeautify.xml(this.code, "");
    } else {
      this.codeOptions.mode = "htmlmixed";
      this.code = this.global.beautify[this.selectedLanguageType](this.code, this.options);
    }
    this.copyMessage();
  }

  clear(){
    this.code = "";
  }

  copyMessage(){
    const selBox = document.createElement('textarea');
    selBox.style.display = '';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  toUpperCaseQuoted = (str) => {
    const regex = /((\".+\")|(\'.+\'))/g;
    const replacements = [];
    let index = 0;
    str = str.replace(regex, (s) => {
      replacements.push(s);
      return '%S' + (index++) + '%';
    })
      .toUpperCase()
      .replace(/%S([0-9]+)%/g, function (s) {
        const k = parseInt(s.match(/([0-9])+/)[0], 0);
        return replacements[k];
      });
    return str;
  }

  selectOption(option: any) {
    this.selectedLanguageType = option.name.toString().toLowerCase();
    this.changeLanguageType();
    this.code = "";
  }

  setOptions = () => {
    this.codeChanged = false;
    this.selectedLanguageType = 'js';
    this.options = {
      'indent_size': 4,
      'indent_char': ' ',
      'eol': '\n',
      'indent_level': 0,
      'max_preserve_newlines': 10,
      'wrap_line_length': 0,
      'operator_position': 'before-newline',
      'brace_style': 'collapse',
      'indent_scripts': 'normal',
      // all boolean options
      'indent_with_tabs': true,
      'preserve_newlines': true,
      'end_with_newline': false,
      'editorconfig': false,
      'space_in_paren': false,
      'space_in_empty_paren': false,
      'jslint_happy': false,
      'space_after_anon_function': false,
      'space_after_named_function': false,
      'unindent_chained_methods': false,
      'break_chained_methods': false,
      'keep_array_indentation': true,
      'unescape_strings': false,
      'e4x': false,
      'comma_first': false,
      'eval_code': false,
      'space_before_conditional': true,
      'indent-inner-html': false
    };
    this.sqlOptions = {
      language: 'sql',
      indentation: 4,
      upperCase: false,
    };
    this.changeLanguageType();
  }

  changeLanguageType = () => {
    switch (this.selectedLanguageType.toUpperCase()) {
      case 'HTML':
        this.options['end_with_newline'] = true;
        this.codeOptions['mode'] = 'htmlmixed';
        break;
      case 'CSS':
        this.options['indent_size'] = 1;
        this.codeOptions['mode'] = 'css';
        break;
      case 'JS':
        this.options['preserve_newlines'] = true;
        this.codeOptions['mode'] = 'javascript';
        break;
      case 'SQL':
        this.codeOptions['mode'] = 'sql';
        break;
      case 'XML':
        this.codeOptions['mode'] = 'xml';
        break;
      case 'JSON':
        this.codeOptions['mode'] = 'application/json';
        break;
      default:
        break;
    }
  }

  validateJSON = (event) => {
    this.options = JSON.parse(event);
  }
}
