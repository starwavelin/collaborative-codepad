import { Component, OnInit } from '@angular/core';

declare var ace: any;

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  languages: string[] = ['Java', 'Python'];
  language: string = 'Java';
  editor: any;

  defaultContent = {
    'Java':
    `public class Solution {
  public static void main(String[] args) {
    // Type your code here
  }
}`,
  'Python':
`class Solution:
  def main():
    # Write your code here
`,
  };

  constructor() { }

  ngOnInit() {
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();
  }

  /**
   * Triggered when user picks a language in the language dropdown 
   * @param lang 
   */
  setLanguage(lang: string): void {
    this.language = lang;
    this.resetEditor();
  } 

  resetEditor(): void {
    this.editor.session.setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  submit(): void {
    let userCode = this.editor.getValue();
    console.log(`Your input code is:\n ${userCode}`); // log user code for now
  }

}
