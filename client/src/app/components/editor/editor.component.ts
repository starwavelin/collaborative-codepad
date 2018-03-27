import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { CollaborationService } from '../../services/collaboration.service';

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
  sessionId: string;

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

  constructor(private collaborationServ: CollaborationService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // In our impl, use problem id as session id
    this.route.params.subscribe(params => {
      this.sessionId = params['id'];
      this.initEditor();
    });
  }

  /**
   * Initialize editor panel and collaboration ability
   */
  initEditor(): void {
    // config editor panel
    this.editor = ace.edit('editor');
    this.editor.setTheme('ace/theme/eclipse');
    this.resetEditor();

     // Init collaborationService
     this.collaborationServ.init(this.editor, this.sessionId);
     this.editor.lastAppliedChange = null;

     // register change callback (listen on change event)
     this.editor.on('change', (e) => {
       console.log(`DEBUG: editor changes: ${JSON.stringify(e)}`); //DEBUG

       /** 
        * check if the change is the same as the last change,
        * if Yes, skip it, we don't need to send the same thing to socket on web server
        */
       if (this.editor.lastAppliedChange != e) {
         this.collaborationServ.change(JSON.stringify(e));
       }
     })

  }  

  resetEditor(): void {
    this.editor.session.setMode(`ace/mode/${this.language.toLowerCase()}`);
    this.editor.setValue(this.defaultContent[this.language]);
  }

  /**
   * Triggered when user picks a language in the language dropdown 
   * @param lang 
   */
  setLanguage(lang: string): void {
    this.language = lang;
    this.resetEditor();
  } 

  submit(): void {
    let userCode = this.editor.getValue();
    console.log(`Your input code is:\n ${userCode}`); // log user code for now
  }

}
