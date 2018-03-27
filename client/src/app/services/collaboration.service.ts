import { Injectable } from '@angular/core';

declare var io: any;

@Injectable()
export class CollaborationService {

  collaborationSocket: any;

  constructor() { }

  init(editor: any, sessionId: string): void {

    /**
     * window.location.origin: the server location of the current page.
     * ie. cur page is "localhost:3000/problems/5", then 
     * window.location.origin = "http://localhost:3000"
     */
    this.collaborationSocket = io(window.location.origin, { query: 'sessionId=' + sessionId });

    /**
     * Listen on change sent from web server
     */
    this.collaborationSocket.on('change', (delta: string) => {
      console.log('DEBUG: collaboration: editor changed by: ' + delta); //DEBUG
      delta = JSON.parse(delta);
      editor.lastAppliedChange = delta;

      // apply these changes on editor
      editor.getSessions().getDocument().applyDeltas([delta]);
    });

    /** 
     * socket.on() -- wait for 'message' event, for now just print the message received from server side
    */
    // this.collaborationSocket.on('message', (msg) => {
    //   console.log(`The message received from the web server is: ${msg}`);
    // })
  }

  /**
   * client side emits changes and inform server and server can notify other collaborators
   */
  change(delta: string): void {
    this.collaborationSocket.emit('change', delta);
  }
}
