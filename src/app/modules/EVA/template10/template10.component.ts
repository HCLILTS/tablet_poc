import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';
import { PlayerConstants } from '../../../common/playerconstants';
import { ActivatedRoute } from '@angular/router';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template10',
  templateUrl: './template10.component.html',
  styleUrls: ['./template10.component.scss']
})
export class TemplateTenComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  blink: boolean = false;
  commonAssets: any = "";
  rightPopup: any;
  wrongPopup: any;
  myoption: any = [];
  feedback: any = "";
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;
  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  questionObj: any;
  confirmAssets: any;
  feedbackAssets: any;
  isPlayVideo: boolean;
  videoReplayd: boolean = false;
  attemptType: string = "";
  attemptTypeClose: string = "";
  correctOpt: any = '';
  isVideoLoaded: boolean = false;
  optionArr: any = [];
  currentIdx: number = 0;
  wrongCounter: number = 0;
  instructiontext: string;
  timernextseg: any = "";
  idArray: any = [];
  speaker: any;
  tempSubscription: Subscription;
  correct_ans_index: any = [];
  speakerTimer: any;
  showAnswerPopup: any;
  showAnswerVO: any;
  ifRightAns: boolean = false;
  popupAssets: any;
  showAnswerSubscription: any;
  answerImageBase: any;
  answerImage: any;
  answerImagelocation: any;
  popupIcon: any;
  popupIconLocation: any;
  isPopupClosed: boolean = false;
  lastQuestionCheck: any;
  popupclosedinRightWrongAns: boolean = false;
  ifWrongAns: boolean = false;
  popupTime: any;
  LastquestimeStart: boolean = false;
  correctAnswerCounter: number = 0;
  correctAnswersArray: any = [];
  selectedAnswersArray: any = [];
  correctAnswerObj: any = {};
  correctAnswerCount: any = 0;
  clappingTimer: any;
  multiCorrectTimer: any;
  multiCorrectPopup: any;
  rightTimer: any;
  audio = new Audio();
  selectedIndex: any;
  rightAnswerPopup: any;
  showAnswerTimer: any;
  videoonshowAnspopUp: any;
  showAnswerRef: any;
  showAnswerfeedback: any;

  @ViewChild('instruction') instruction: any;
  @ViewChild('audioEl') audioEl: any;
  @ViewChild('sprite', {static: true}) sprite: any;
  @ViewChild('speakerNormal') speakerNormal: any;
  @ViewChild('ansPopup') ansPopup: any;
  @ViewChild('wrongFeedback') wrongFeedback: any;
  @ViewChild('wrongFeedbackOnAkshar') wrongFeedbackOnAkshar: any;
  @ViewChild('rightFeedback') rightFeedback: any;
  @ViewChild('disableSpeaker') disableSpeaker: any;
  @ViewChild('myAudiospeaker') myAudiospeaker: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('footerNavBlock') footerNavBlock: any;
  @ViewChild('clapSound') clapSound: any;
  @ViewChild('overlay') overlay: any;
  @ViewChild('multiCorrectFeedback') multiCorrectFeedback: any;
  @ViewChild('refQuesWord') refQuesWord: any;
  @ViewChild('optionsContainer', {static: true}) optionsContainer: any;

  constructor(private appModel: ApplicationmodelService, private ActivatedRoute: ActivatedRoute, private Sharedservice: SharedserviceService) {

    //subscribing common popup from shared service to get the updated event and values of speaker
    this.Sharedservice.showAnsRef.subscribe(showansref => {
      this.showAnswerRef = showansref;
    })

    this.Sharedservice.showAnswerfeedback.subscribe(showanswerfeedback => {
      this.showAnswerfeedback = showanswerfeedback;
    });
    this.Sharedservice.videoonshowAnspopUp.subscribe(videoonsAnspopUp => {
      this.videoonshowAnspopUp = videoonsAnspopUp;
    });
    this.appModel = appModel;
    if (!this.appModel.isVideoPlayed) {
      this.isVideoLoaded = false;
    } else {
      this.appModel.setLoader(true);
      // if error occured during image loading loader wil stop after 5 seconds 
      this.loaderTimer = setTimeout(() => {
        this.appModel.setLoader(false);
      }, 5000);
    }
    this.appModel.notification.subscribe(
      (data) => {
        console.log('Component: constructor - data=', data);
        switch (data) {
          case PlayerConstants.CMS_PLAYER_CLOSE:
            this.close();
            break;
          default:
            console.log('Component: constructor - default');
            break;
        }
      }
    );
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
  }

  ngOnInit() {
    this.Sharedservice.setShowAnsEnabled(false);
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    this.attemptType = "";
    this.setTemplateType();
    console.log("this.attemptType = " + this.attemptType);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    this.setData();
    this.questionObj.letters.forEach(question => {
      if (question.correct_ans && question.correct_ans.correct_ans_obj) {
        this.correctAnswerCount = this.correctAnswerCount + Object.keys(question.correct_ans.correct_ans_obj).length;
      }
    });
    this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        console.log("manual mode ", mode);

      } else if (mode == "auto") {
        console.log("auto mode", mode);
        this.attemptType = "uttarDikhayein";
      }
    })


    this.showAnswerSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
      this.appModel.stopAllTimer();
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      this.rightFeedback.nativeElement.pause();
      this.rightFeedback.nativeElement.currentTime = 0;
      this.wrongFeedbackOnAkshar.nativeElement.pause();
      this.wrongFeedbackOnAkshar.nativeElement.currentTime = 0;
      if (!this.wrongFeedback.nativeElement.paused) {
        this.wrongFeedback.nativeElement.pause();
        this.wrongFeedback.nativeElement.currentTime = 0;
        this.shuffleOptions();
      }
      if (!this.audio.paused) {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.enableAllOptions();
      }
      clearTimeout(this.clappingTimer);
      this.optionsContainer.nativeElement.classList.add("disableDiv");
      this.refQuesWord.nativeElement.children[this.selectedIndex].classList.remove("blinkOn");
      this.disableSpeaker.nativeElement.classList.remove("disableDiv");
      const speakerEle = document.getElementsByClassName("speakerBtn")[0].children[2] as HTMLAudioElement;
      if (!speakerEle.paused) {
        speakerEle.pause();
        speakerEle.currentTime = 0;
        this.sprite.nativeElement.style = "display:none";
        (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
        this.speaker.imgsrc = this.speaker.imgorigional;
      }
      if (this.showAnswerRef && this.showAnswerRef.nativeElement) {
        this.videoonshowAnspopUp.nativeElement.src = this.showAnswerPopup.video.location == "content" ? this.containgFolderPath + "/" + this.showAnswerPopup.video.url : this.assetsPath + "/" + this.showAnswerPopup.video.url;
        this.showAnswerRef.nativeElement.classList = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
        if (this.videoonshowAnspopUp && this.videoonshowAnspopUp.nativeElement) {
          this.videoonshowAnspopUp.nativeElement.play();
          this.videoonshowAnspopUp.nativeElement.onended = () => {
            this.showAnswerTimer = setTimeout(() => {
              this.closePopup('showAnswer');
            }, 10000);
          }
        }
      }

    })


    this.appModel.nextBtnEvent().subscribe(() => {
      alert();
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.ansPopup && this.ansPopup.nativeElement) {
          this.ansPopup.nativeElement.classList = "displayPopup modal";
        }
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
      this.appModel.notifyUserAction();

    })
  }
  ngOnDestroy() {
    this.showAnswerSubscription.unsubscribe();
    clearTimeout(this.clappingTimer);
    clearTimeout(this.rightTimer);
    clearTimeout(this.multiCorrectTimer);
    this.audio.pause();
  }

  ngAfterViewInit() {
    this.sprite.nativeElement.style = "display:none";
    this.optionsContainer.nativeElement.classList.add("disableDiv");
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
    if (this.getChromeVersion() < 71) {
      for (let i = 0; i < this.refQuesWord.nativeElement.children.length; i++) {
        this.refQuesWord.nativeElement.children[i].style.width = "fit-content";
      }
    }

  }

  /****Set data for the Template****/
  setData() {
    this.appModel.notifyUserAction();
    const fetchedData: any = this.appModel.content.contentData.data;
    this.instructiontext = fetchedData.instructiontext;
    this.myoption = JSON.parse(JSON.stringify(fetchedData.options));
    this.commonAssets = fetchedData.commonassets;
    this.speaker = fetchedData.speaker;
    this.feedback = fetchedData.feedback;
    this.questionObj = JSON.parse(JSON.stringify(fetchedData.quesObj));
    this.noOfImgs = fetchedData.imgCount;
    this.popupAssets = fetchedData.feedback.popupassets;
    this.correct_ans_index = this.feedback.correct_ans_index;
    this.rightPopup = this.feedback.right_ans_sound;
    this.wrongPopup = this.feedback.wrong_ans_sound;
    this.multiCorrectPopup = this.feedback.all_correct_sound;
    this.showAnswerVO = this.feedback.show_ans_sound;
    this.showAnswerPopup = this.feedback.show_ans_popup;
    this.rightAnswerPopup = this.feedback.right_ans_popup;
    this.lastQuestionCheck = this.commonAssets.ques_control.isLastQues;
    this.commonAssets.ques_control.blinkingStatus = false;
    this.isLastQues = this.appModel.isLastSection;
    this.isLastQuesAct = this.appModel.isLastSectionInCollection;
    this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
    setTimeout(() => {
      if (this.footerNavBlock && this.footerNavBlock.nativeElement) {
        this.footerNavBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around";
      }
    }, 200)

  }

  /******Set template type for EVA******/
  setTemplateType(): void {
    this.ActivatedRoute.data.subscribe(data => {
      this.Sharedservice.sendData(data);
    })
  }

  /******* Volume control for all VO  *******/
  templatevolume(vol, obj) {
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.myAudiospeaker && obj.myAudiospeaker.nativeElement) {
      obj.myAudiospeaker.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
      obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.rightFeedback && obj.rightFeedback.nativeElement) {
      obj.rightFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.clapSound && obj.clapSound.nativeElement) {
      obj.clapSound.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.showAnswerfeedback && obj.showAnswerfeedback.nativeElement) {
      obj.showAnswerfeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.audio) {
      obj.audio.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.multiCorrectFeedback && obj.multiCorrectFeedback.nativeElement) {
      obj.multiCorrectFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedbackOnAkshar && obj.wrongFeedbackOnAkshar.nativeElement) {
      obj.wrongFeedbackOnAkshar.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.videoonshowAnspopUp && obj.videoonshowAnspopUp.nativeElement) {
      obj.videoonshowAnspopUp.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
  }

  /****Get base path****/
  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  /*****Play speaker audio*****/
  playSpeaker(el: HTMLAudioElement, speaker) {
    this.stopAllSounds();
    this.enableAllOptions();
    if (!this.instruction.nativeElement.paused) {
      console.log("instruction voice still playing");
    } else {
      this.myAudiospeaker.nativeElement.currentTime = 0.0;
      if (el.id == "S") {
        this.myAudiospeaker.nativeElement.pause();
        if (el.paused) {
          el.currentTime = 0;
          el.play();
        } else {
          el.currentTime = 0;
          el.play();
        }
        this.speakerTimer = setInterval(() => {
          speaker.imgsrc = speaker.imgactive;
          this.sprite.nativeElement.style = "display:flex";
          (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "none";
          this.checkSpeakerVoice(speaker);
        }, 10)
      } else {
        if (this.myAudiospeaker && this.myAudiospeaker.nativeElement) {
          this.myAudiospeaker.nativeElement.pause();
        }
        el.pause();
        el.currentTime = 0;
        el.play();
        if (this.maincontent) {
          this.maincontent.nativeElement.className = "disableDiv";
        }
        el.onended = () => {
          if (this.maincontent) {
            this.maincontent.nativeElement.className = "";
            (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
            this.sprite.nativeElement.style = "display:none";
          }
        }

      }
    }
  }

  /*****Check speaker voice*****/
  checkSpeakerVoice(speaker) {
    if (!this.audioEl.nativeElement.paused) {
    } else {
      speaker.imgsrc = speaker.imgorigional;
      this.sprite.nativeElement.style = "display:none";
      (document.getElementById("spkrBtn") as HTMLElement).style.pointerEvents = "";
      clearInterval(this.speakerTimer);
    }
  }

  /*********SPEAKER HOVER *********/
  onHoverSpeaker(speaker) {
    speaker.imgsrc = speaker.imghover;
  }

  /******Hover out speaker ********/
  onHoverOutSpeaker(speaker) {
    speaker.imgsrc = speaker.imgorigional;
  }

  /****** sets clapping timer ********/
  setClappingTimer(feedback, popupRef?) {
    this.stopAllSounds();
    this.clapSound.nativeElement.play();
    this.clappingTimer = setTimeout(() => {
      this.clapSound.nativeElement.pause();
      this.clapSound.nativeElement.currentTime = 0;
      if (popupRef) {
        popupRef.className = "modal d-flex align-items-center justify-content-center showit ansPopup dispFlex";
      }
      feedback.nativeElement.play();
    }, 2000);
  }

  /****** Show right answer popup after all all correct matra selection  ********/
  showRightAnswerPopup() {
    if (this.multiCorrectFeedback && this.multiCorrectFeedback.nativeElement) {
      const rightAnswerPopup: HTMLElement = this.ansPopup.nativeElement as HTMLElement;
      this.setClappingTimer(this.multiCorrectFeedback, rightAnswerPopup);
    }
    this.multiCorrectFeedback.nativeElement.onended = () => {
      this.disableSpeaker.nativeElement.classList.remove("disableDiv");
      this.maincontent.nativeElement.className = "disableDiv";
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
      this.rightTimer = setTimeout(() => {
        this.closePopup('answerPopup');
      }, 10000);
    }
  }

  handleMarginOnAksharToggle(matraArrIndex, id, marginValue) {
    if(matraArrIndex.indexOf(id) > -1) {
      this.refQuesWord.nativeElement.children[matraArrIndex[matraArrIndex.indexOf(id)]].style["margin"] = "0";
    } else if (matraArrIndex.indexOf(id-1) > -1) {
      this.refQuesWord.nativeElement.children[matraArrIndex[matraArrIndex.indexOf(id-1)]].style["margin"] = "0";
    } else {
      matraArrIndex.forEach(index => {
        this.refQuesWord.nativeElement.children[index].style["margin-right"] = marginValue;
      });
    }
  }

  checkAkshar(letter, id) {
    //reset Akshar selection
    const ooMatraArrIndex = [];
    const angMatraArrIndex = [];
    for (let i = 0; i < this.refQuesWord.nativeElement.children.length; i++) {
      if (this.refQuesWord.nativeElement.children[i].classList.contains("blinkOn")) {
        this.refQuesWord.nativeElement.children[i].classList.remove("blinkOn");
      }
      if(this.refQuesWord.nativeElement.children[i].getAttribute("matra") === "oo") {
        ooMatraArrIndex.push(i);
      } else if (this.refQuesWord.nativeElement.children[i].getAttribute("matra") === "ang") {
        angMatraArrIndex.push(i);
      }
    }
    this.handleMarginOnAksharToggle(ooMatraArrIndex, id, "0");
    this.handleMarginOnAksharToggle(angMatraArrIndex, id, "-3%");
    this.selectedIndex = id;
    this.refQuesWord.nativeElement.children[id].classList.add("blinkOn");
    //check if user clicked wrong akshar
    if(!letter.correct_index || this.questionObj.letters[this.selectedIndex].matraadded.length === Object.keys(this.questionObj.letters[this.selectedIndex].correct_ans.correct_ans_obj).length) {
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
      }
      this.optionsContainer.nativeElement.classList.add("disableDiv");
      this.refQuesWord.nativeElement.classList.add("disableDiv");
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      setTimeout(() => {
        if (this.wrongFeedbackOnAkshar && this.wrongFeedbackOnAkshar.nativeElement) {
          this.stopAllSounds();
          this.enableAllOptions();
          this.wrongFeedbackOnAkshar.nativeElement.play();
        }

        this.wrongFeedbackOnAkshar.nativeElement.onended = () => {
          this.refQuesWord.nativeElement.children[id].classList.remove("blinkOn");
          this.addMatraMargin();
          this.disableSpeaker.nativeElement.classList.remove("disableDiv");
          this.refQuesWord.nativeElement.classList.remove("disableDiv");
          for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
          }
        }
      });
    } else {
      this.correctAnswerObj = letter;
      this.optionsContainer.nativeElement.classList.remove("disableDiv");
    }
  }

  addMatraMargin() {
      for (let i = 0; i < this.refQuesWord.nativeElement.children.length; i++) {
        let matraValue = this.refQuesWord.nativeElement.children[i].getAttribute("matra");
        if(matraValue === "oo") {
        this.refQuesWord.nativeElement.children[i].style["margin-right"] = "0";//-2%
        } else if (matraValue === "ang" && this.questionObj.letters[i].matraadded &&  this.questionObj.letters[i].matraadded.length === 1) {
          this.refQuesWord.nativeElement.children[i].style["margin-right"] = "-3%";
        }
      } 
  }
  /****Check answer on option click*****/
  checkAnswer(option, index) {
    const selectedOption = this.optionsContainer.nativeElement.children[index];
    const selectedAkshar = this.questionObj.letters[this.selectedIndex];
    // if selected option is empty
    if (selectedOption && !selectedOption.children[1]) {
      return;
    }
    for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
      document.getElementsByClassName("ansBtn")[i].classList.add("disableDiv");
    }
    this.stopAllSounds("clicked");
    if (option.matravalue === "oo") {
      this.refQuesWord.nativeElement.children[this.selectedIndex].setAttribute("matra","oo");
    } else if(option.matravalue === "ang") {
      this.refQuesWord.nativeElement.children[this.selectedIndex].setAttribute("matra","ang");
    }
    const matraIndex = selectedAkshar.matraadded.indexOf(option.matravalue);
    if (this.correctAnswerObj.correct_index.indexOf(option.id) > -1 && matraIndex < 0) {
      this.correctAnswerCounter++;
      this.appModel.stopAllTimer();
      selectedAkshar.matraadded.push(option.matravalue);
      this.myoption[index].selected = true;
      option.optBg = option.optBg_original;
      this.ifRightAns = true;
      if (selectedAkshar.matra_selected === 0) {
        selectedAkshar.url = selectedAkshar.correct_ans.correct_ans_obj[option.matravalue] && selectedAkshar.correct_ans.correct_ans_obj[option.matravalue].url;
        selectedAkshar.matra_selected++;
      } else {
        this.refQuesWord.nativeElement.children[this.selectedIndex].style["margin-right"] = "0%";
        selectedAkshar.url = selectedAkshar.correct_ans.url;
      }
      selectedAkshar.location = "content";
      this.refQuesWord.nativeElement.children[this.selectedIndex].children[0].classList.remove("dark");
      selectedOption.children[1].remove();

      //disable matras and akshars
      this.optionsContainer.nativeElement.classList.add("disableDiv");
      this.refQuesWord.nativeElement.classList.add("disableDiv");
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      this.refQuesWord.nativeElement.children[this.selectedIndex].classList.remove("blinkOn");
      this.addMatraMargin();

      this.popupIcon = this.popupAssets.right_icon.url;
      this.popupIconLocation = this.popupAssets.right_icon.location;

      setTimeout(() => {
        if (this.rightFeedback && this.rightFeedback.nativeElement) {
          if (this.correctAnswerCounter === this.correctAnswerCount) {
            this.showRightAnswerPopup();
            this.appModel.storeVisitedTabs();
          } else {
            this.setClappingTimer(this.rightFeedback);
            this.rightFeedback.nativeElement.onended = () => {
              this.refQuesWord.nativeElement.classList.remove("disableDiv");
              this.disableSpeaker.nativeElement.classList.remove("disableDiv");
              for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
                document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
              }
            }
          }
        }
      })
    } else {
      this.ifWrongAns = true;
      option.optBg = option.optBg_original;
      this.refQuesWord.nativeElement.classList.add("disableDiv");
      this.optionsContainer.nativeElement.classList.add("disableDiv");
      this.disableSpeaker.nativeElement.classList.add("disableDiv");
      //play wrong feed back audio
      this.wrongCounter += 1;
      setTimeout(() => {
        if (this.wrongFeedback && this.wrongFeedback.nativeElement) {
          this.stopAllSounds();
          this.wrongFeedback.nativeElement.play();
        }

        this.wrongFeedback.nativeElement.onended = () => {
          this.refQuesWord.nativeElement.classList.remove("disableDiv");
          this.disableSpeaker.nativeElement.classList.remove("disableDiv");
          this.shuffleOptions();
          this.addMatraMargin();
          for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
            document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
          }
          this.refQuesWord.nativeElement.children[this.selectedIndex].classList.remove("blinkOn");
        }
      });
    }
  }

  shuffleOptions() {
    this.idArray = [];
    for (let i of this.myoption) {
      this.idArray.push(i.id);
    }
    this.doRandomize(this.myoption);
    this.disableSpeaker.nativeElement.classList.remove("disableDiv");
    if (this.wrongCounter >= 3 && this.ifWrongAns) {
      this.Sharedservice.setShowAnsEnabled(true);
    }
  }

  /****Randomize option on wrong selection*****/
  doRandomize(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      const optionBg1 = array[currentIndex].optBg;
      const img_hover1 = array[currentIndex].optBg_hover;
      const text1copy = array[currentIndex].optBg_original;

      const optionBg2 = array[randomIndex].optBg;
      const img_hover2 = array[randomIndex].optBg_hover;
      const text2copy = array[randomIndex].optBg_original;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;

      array[currentIndex].optBg = optionBg1;
      array[currentIndex].optBg_hover = img_hover1;
      array[currentIndex].optBg_original = text1copy;

      array[randomIndex].optBg = optionBg2;
      array[randomIndex].optBg_hover = img_hover2;
      array[randomIndex].optBg_original = text2copy;

    }
    const flag = this.arraysIdentical(array, this.idArray);
    if (flag) {
      this.doRandomize(array);
    }
  }

  /*****Check if array is identical******/
  arraysIdentical(a, b) {
    let i = a.length;
    while (i--) {
      if (a[i].id == b[i]) {
        return true;
      }
    }
    return false;
  }

  close() {
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
  }

  /*****Close popup on click*****/
  closePopup(Type) {
    clearTimeout(this.rightTimer);
    clearTimeout(this.clappingTimer);
    clearTimeout(this.showAnswerTimer);

    this.showAnswerRef.nativeElement.classList = "modal";
    this.ansPopup.nativeElement.classList = "modal";

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.videoonshowAnspopUp.nativeElement.pause();
    this.videoonshowAnspopUp.nativeElement.currentTime = 0;

    this.multiCorrectFeedback.nativeElement.pause();
    this.multiCorrectFeedback.nativeElement.currentTime = 0;

    this.wrongFeedbackOnAkshar.nativeElement.pause();
    this.wrongFeedbackOnAkshar.nativeElement.currentTime = 0;

    this.refQuesWord.nativeElement.classList.remove("disableDiv");

    if (Type === "answerPopup") {
      this.popupclosedinRightWrongAns = true;
      for (let i = 0; i < document.getElementsByClassName("ansBtn").length; i++) {
        document.getElementsByClassName("ansBtn")[i].classList.remove("disableDiv");
      }
      if (this.ifRightAns) {
        this.Sharedservice.setShowAnsEnabled(true);
        this.overlay.nativeElement.classList.value = "fadeContainer";
        this.blinkOnLastQues();
        if (!this.lastQuestionCheck) {
          this.popupTime = setTimeout(() => {
          }, 10000)
        } else if (this.lastQuestionCheck) {
          this.Sharedservice.setTimeOnLastQues(true);
        }
      }
    } else if (Type === 'showAnswer') {
      if (this.correctAnswerCounter === this.correctAnswerCount) {
        this.blinkOnLastQues();
      }
    }
  }

  /***** Blink on last question ******/
  blinkOnLastQues() {
    this.Sharedservice.setLastQuesAageyBadheStatus(false);
    if (this.lastQuestionCheck) {
      this.LastquestimeStart = true;
    }
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues();
      this.appModel.stopAllTimer();
      if (!this.appModel.eventDone) {
        if (this.isLastQuesAct) {
          this.appModel.eventFired();
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'exit' };

        }
      }
    } else {
      this.appModel.moveNextQues("");
    }
  }

  checkImgLoaded() {
    if (!this.loadFlag) {
      this.noOfImgsLoaded++;
      if (this.noOfImgsLoaded >= this.noOfImgs) {
        this.appModel.setLoader(false);
        this.loadFlag = true;
        clearTimeout(this.loaderTimer);
        this.checkforQVO();
      }
    }
  }

  checkforQVO() {
    if (this.questionObj && this.questionObj.quesInstruction && this.questionObj.quesInstruction.url && this.questionObj.quesInstruction.autoPlay) {
      this.instruction.nativeElement.src = this.questionObj.quesInstruction.location == "content"
        ? this.containgFolderPath + "/" + this.questionObj.quesInstruction.url : this.assetsPath + "/" + this.questionObj.quesInstruction.url
      this.appModel.handlePostVOActivity(true);
      this.maincontent.nativeElement.className = "disableDiv";
      this.instruction.nativeElement.play();
      this.appModel.setLoader(false);
      this.instruction.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        this.maincontent.nativeElement.className = "";
      }
    } else {
      this.appModel.handlePostVOActivity(false);
    }
  }

  /******On Hover option ********/
  onHoverOptions(option) {
    if (!this.myAudiospeaker.nativeElement.paused) {
      this.myAudiospeaker.nativeElement.pause();
      this.myAudiospeaker.nativeElement.currentTime = 0;
      this.speaker.imgsrc = this.speaker.imgorigional;
    }
    option.optBg = option.optBg_hover;
  }

  /******Hover out option ********/
  onHoveroutOptions(option) {
    option.optBg = option.optBg_original;
  }

  /****** Option Hover VO  *******/
  playOptionHover(option, index) {
    if (option && option.audio && option.audio.url && !option.selected) {
      this.playSound(option.audio, index);
    }
  }
  /***** Play sound on option roll over *******/
  playSound(soundAssets, idx) {
    if (this.audio && this.audio.paused) {
      if (soundAssets.location == 'content') {
        this.audio.src = this.containgFolderPath + '/' + soundAssets.url;
      } else {
        this.audio.src = soundAssets.url;
      }
      this.audio.load();
      this.audio.play();
      for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
        if (i != idx) {
            this.optionsContainer.nativeElement.children[i].classList.add("disableDiv");
        }
    }
    this.audio.onended = () => {
        this.enableAllOptions();
    }
    }
  }

  /******On Hover close popup******/
  hoverClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_hover;
  }

  /******Hover out close popup******/
  houtClosePopup() {
    this.popupAssets.close_button = this.popupAssets.close_button_origional;
  }

  /***** Enable all options and speaker on audio end *******/
  enableAllOptions() {
    for (let i = 0; i < this.optionsContainer.nativeElement.children.length; i++) {
      if (this.optionsContainer.nativeElement.children[i].classList.contains("disableDiv")  && !this.myoption[i].selected) {
        this.optionsContainer.nativeElement.children[i].classList.remove("disableDiv");
      }
    }
  }

  /** Function to stop all sounds **/
  stopAllSounds(clicked?) {
    this.audio.pause();
    this.audio.currentTime = 0;

    this.myAudiospeaker.nativeElement.pause();
    this.myAudiospeaker.nativeElement.currentTime = 0;

    this.wrongFeedback.nativeElement.pause();
    this.wrongFeedback.nativeElement.currentTime = 0;

    this.rightFeedback.nativeElement.pause();
    this.rightFeedback.nativeElement.currentTime = 0;

    this.clapSound.nativeElement.pause();
    this.clapSound.nativeElement.currentTime = 0;

    this.wrongFeedbackOnAkshar.nativeElement.pause();
    this.wrongFeedbackOnAkshar.nativeElement.currentTime = 0;

    if(clicked) {
      this.enableAllOptions();
    }
  }

  getChromeVersion(): any {
    const appVersion = navigator.appVersion.match(/.*Chrome\/([0-9\.]+)/)[1];
    return appVersion && appVersion.split('.')[0];
  }

}
