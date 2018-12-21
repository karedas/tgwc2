import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageState } from '../store/state/message.state';
import { IncomingMessage, MessageEventType, PlayerIsLoggedIn } from '../store/actions/message.action';
import { UpdateUi } from '../store/actions/client.action';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class MessageService {

  private idMessage: number = 0;

  constructor(private store: Store<MessageState>) {
  }

  // getMessages(data):Observable<string> {
  // }

  parse(data): void {
    this.parseForDisplay(this.preParseText(data));
  }

  preParseText(data: string): string {
    /* Remove -not-tags- */
    data = data.replace(/\r/gm, '');
    data = data.replace(/&!!/gm, '');
    data = data.replace(/\$\$/gm, '$');
    data = data.replace(/%%/gm, '%');
    data = data.replace(/&&/gm, '&#38;');
    data = data.replace(/</gm, '&#60;');
    data = data.replace(/>/gm, '&#62;');

    return data;
  }

  parseForDisplay(data: string) {
    const messageState: MessageState = {} as MessageState;
    messageState.timestamp = new Date().getTime();

    let pos: any;

    //Hide text (password)
    data = data.replace(/&x\n*/gm, (msg) => {
      messageState.data = msg;
      messageState.type = 'hideInputText';
      this.store.dispatch({ type: MessageEventType.IN, payload: messageState });
      // _.inputPassword();
      return '';
    });

    //Show text (normal input)
    data = data.replace(/&e\n*/gm, () => {
      messageState.data = data;
      messageState.type = 'ShowInputText';
      this.store.dispatch({ type: MessageEventType.IN, payload: messageState });
      // _.inputText();
      return '';
    });

    // Sky picture
    data = data.replace(/&o.\n*/gm, (sky) => {
      let sky_parse = sky.charAt(2);
      messageState.data = sky_parse;
      messageState.type = 'SkyPicture';
      this.store.dispatch({ type: MessageEventType.IN, payload: messageState });
      // _.setSky(sky_parse);
      return '';
    });

    // Exits info
    data = data.replace(/&d\d{6}\n*/gm, (doors) => {
      let doors_parse = doors.substr(2, 6);
      messageState.data = doors_parse;
      messageState.type = 'ExitsInformation';
      this.store.dispatch({ type: MessageEventType.IN, payload: messageState });
      // _.setDoors(doors_parse);
      return '';
    });

    // Audio
    data = data.replace(/&!au"[^"]*"\n*/gm, (audio) => {
      let audio_parse = audio.slice(5, audio.lastIndexOf('"'));
      messageState.data = audio_parse;
      messageState.type = 'Audio';
      this.store.dispatch({ type: MessageEventType.IN, payload: messageState });
      // _.playAudio(audio_parse);
      return '';
    });

    // Player status
    data = data.replace(/&!st"[^"]*"\n*/gm, (status) => {
      let status_parse = status.slice(5, status.lastIndexOf('"')).split(',');
      messageState.data = status_parse;
      messageState.type = 'status';
      // return _.setStatus(status_parse);
      this.store.dispatch(new IncomingMessage(messageState));
      return '';
    });


    // Player status server Update 
    data = data.replace(/&!up"[^"]*"\n*/gm, (update) => {
      // let update_parse = update.slice(5, status.lastIndexOf('"')).split(',');
      this.store.dispatch(new UpdateUi());
      // if (update_parse[0] > test)
      //   this.store.dispatch(new UpdateInventory());      

      // if (update_parse[1] > _.client_update.equipment.version)
      //   this.store.dispatch(new UpdateEquipment());

      // if (update_parse[2] > _.client_update.room.version)
      // //     _.client_update.room.needed = true;

      return '';
    });

    // Image in side frame (with gamma)
    data = data.replace(/&!img"[^"]*"\n*/gm, function (image) {
      // let image = image.slice(6, image.lastIndexOf('"')).split(',');
      // showImageWithGamma(image[0], image[1], image[2], image[3]);
      return '';
    });

    // Image in side frame
    data = data.replace(/&!im"[^"]*"\n*/gm, function (image) {
      let image_parse = image.slice(5, image.lastIndexOf('"'));
      // _.showImage(image_parse);
      return '';
    });

    // Player is logged in
    data = data.replace(/&!logged"[^"]*"/gm, function () {
        // _.inGame = true;
        // _.processCommands('info; stato; @rima', false);
        messageState.type = 'status';
        // return _.setStatus(status_parse);
        this.store.dispatch(new PlayerIsLoggedIn());
        return '';
    });

    // Close the text editor
    data = data.replace(/&!ea"[^"]*"\n*/gm, function (options) {
      // this.store.dispatch(new )
        // _.closeEditor();
        return '';
    });


    data.replace(/<p><\/p>/g, '');


    /* \r is already removed at top */
    data = data.replace(/\n/gm, '<br>');

    if (data != '') {
      // data = '<div class="tg-line">' + _.replaceColors(msg) + '</div>';
    }

    // messageState.data = data;
    // this.store.dispatch(new IncomingMessage(data.replace(/<p><\/p>/g, ''));
    // this.parseSubject.next(data);
  }
}
