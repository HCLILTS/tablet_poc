import { Component, OnInit, HostListener, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { Subject, Observable, Subscription } from 'rxjs'
import 'jquery';
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
declare var $: any;

@Component({
  selector: 'ntemp3',
  templateUrl: './Ntemplate3.component.html',
  styleUrls: ['./Ntemplate3.component.scss'],

})

export class NTemplate3Component implements OnInit, OnDestroy, AfterViewChecked  {
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      //this.checkforQVO();
    }, 5000);
    this.appModel.notification.subscribe(
      (data) => {
        console.log('Component: constructor - data=', data);
        switch (data) {
          case PlayerConstants.CMS_PLAYER_CLOSE:
            //console.log('VideoComponent: constructor - cmsPlayerClose');
            this.close();
            break;

          default:
            console.log('Component: constructor - default');
            break;
        }
      }
    );
  }

  @ViewChild("optionsBlock") optionsBlock: any;
  @ViewChild('narrator') narrator: any;
  @ViewChild('instruction') instruction: any;
  @ViewChild('optionAudio') optionAudio: any;
  @ViewChild('maincontent') maincontent: any;
  @ViewChild('confirmModalRef') confirmModalRef: any;
  @ViewChild('submitModalRef') submitModalRef: any;
  @ViewChild('infoModalRef') infoModalRef: any;
  @ViewChild('modalRef') modalRef: any;
  @ViewChild('mainmodalRef') mainmodalRef: any;
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupBodyRef') popupBodyRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('feedbackPopupAudio') feedbackPopupAudio: any;
  @ViewChild('partialpopupRef') partialpopupRef: any;
  @ViewChild('feedbackpartialPopupAudio') feedbackpartialPopupAudio: any;
  @ViewChild('partialpopupBodyRef') partialpopupBodyRef: any;
  @ViewChild('mainVideo') mainVideo: any;
  @ViewChild('confirmReplayRef') confirmReplayRef: any;
  @ViewChild('titleNavBtn') titleNavBtn: any;
  @ViewChild('titleAudio') titleAudio: any;
  @ViewChild('feedbackInfoAudio') feedbackInfoAudio: any;
  @ViewChild('onlyOneAttemptModalRef') onlyOneAttemptModalRef: any;
  @ViewChild('feedbackoneAttemptAudio') feedbackoneAttemptAudio: any;


  quesInfo: any = "";
  audio = new Audio();
  currentIdx = 0;
  commonAssets: any = "";
  feedback: any = "";
  narratorAudio: any;
  checked: boolean = false;
  showIntroScreen: boolean;

 
  correctOpt: any;
  noOfRightAnsClicked: number = 0;
  noOfWrongAnsClicked: number = 0;
  rightansArray: any = [];
  rightansArray1: any = [];
  rightansArray2: any = [];
  wrongansArray1: any = [];
  wrongansArray2: any = [];
  AnsObj: any = [];
  ansArray1: any = [];
  Array2required: boolean = false;
  partialpopupRequired: boolean = false;
  wrongansArray: any = [];
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  feedbackAudio: any;
  correctImg: any;
  incorrectImg: any;
  popupAssets: any;
  confirmPopupAssets: any;
  infoPopupAssets: any;
  oneAttemptPopupAssets: any;
  replayconfirmAssets: any;
  submitPopupAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  quesObj: any;
  isPlayVideo: boolean;
  videoReplayd: boolean;
  count: number = 0;
  attemptType: string = "";
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  currentAudioIndex: number;
  PlayPauseFlag:boolean = true;
  skipFlag:boolean = true;
  styleHeaderPopup:any;
  styleBodyPopup:any;
  backgroundAssets:any;
  /*Start: Theme Implementation(Template Changes)*/
  controlHandler = {
		isSubmitRequired:false,
    isReplayRequired:false
  };
  themePath:any;
  InstructionVo:boolean=false;
  fetchedcontent:any;
  functionalityType:any;
  bgSubscription: Subscription;
  /*End: Theme Implementation(Template Changes)*/
  disableDiv:boolean = false;
  quesSkip:boolean = false;
  showAnsTimeout:number;
  disableSection:boolean = false;
  enableOption:boolean = false;
  confirmPopupSubscription: any;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  actComplete : boolean = false;
  disableParent: boolean = false;

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      console.log("play on Instruction");
      if (this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
      //  this.disableSection=true;
        this.InstructionVo = true;
       // $(".instructionBase").css("cursor", "default");
        this.instruction.nativeElement.onended = () => {
        //  this.disableSection=false;
          this.InstructionVo = false;
       // $(".instructionBase").css("cursor", "pointer");
        }
      }
      if (!this.optionAudio.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
    }
  }

  onHoverOption(opt, i, j) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "pointer";
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "scale(1.1)";
        this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transition = "all 0.3s ease-in-out";
      }
    }
  }


  playHoverOption(opt, i, j) {
    this.InstructionVo = false;
    this.appModel.notifyUserAction();
    if(opt.imgsrc_audio.url != "" || opt.imgsrc_audio.location != "") {
        
         if (this.optionsBlock.nativeElement.children[i].children[j].children[1].paused && this.narrator.nativeElement.paused) {
            this.optionsBlock.nativeElement.children[i].children[j].children[1].src = opt.imgsrc_audio.url+ "?someRandomSeed=" + Math.random().toString(36);;
            this.optionsBlock.nativeElement.children[i].children[j].children[1].load();
            if (!this.instruction.nativeElement.paused) {
              this.instruction.nativeElement.pause();
            }
            this.optionsBlock.nativeElement.children[i].children[j].children[1].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
            this.optionsBlock.nativeElement.children[i].children[j].children[1].play();
            if (i == 0) {
              if (this.optionsBlock.nativeElement.children[1] != undefined) {
                this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
              }
              if (this.optionsBlock.nativeElement.children[2] != undefined) {
                this.optionsBlock.nativeElement.children[2].style.pointerEvents = "none";
              }
            } else if(i == 1) {
              if (this.optionsBlock.nativeElement.children[0] != undefined) {
                this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
              }
              if (this.optionsBlock.nativeElement.children[2] != undefined) {
                this.optionsBlock.nativeElement.children[2].style.pointerEvents = "none";
              }
            } else {
              if (this.optionsBlock.nativeElement.children[0] != undefined) {
                this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
              }
              if (this.optionsBlock.nativeElement.children[1] != undefined) {
                this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
              }
            }
            for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
              if (x != j) {
                this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "none";
              }
            }
            //this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
            this.optionsBlock.nativeElement.children[i].children[j].children[1].onended = () => {
              if (i == 0) {
                if (this.optionsBlock.nativeElement.children[1] != undefined) {
                  this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
                }
                if (this.optionsBlock.nativeElement.children[2] != undefined) {
                  this.optionsBlock.nativeElement.children[2].style.pointerEvents = "";
                }
              } else if(i==1) {
                if (this.optionsBlock.nativeElement.children[0] != undefined) {
                  this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
                }
                if (this.optionsBlock.nativeElement.children[2] != undefined) {
                  this.optionsBlock.nativeElement.children[2].style.pointerEvents = "";
                }
              } else {
                if (this.optionsBlock.nativeElement.children[0] != undefined) {
                  this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
                }
                if (this.optionsBlock.nativeElement.children[1] != undefined) {
                  this.optionsBlock.nativeElement.children[1].style.pointerEvents = "";
                }
              }
              for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
                if (x != j) {
                  this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "";
                }
              }
            } 
       }
    }
  }

  optionHover(opt, i,j) {
    this.onHoverOption(opt, i, j);
  }
          
  onHoverOptionOut(opt, i, j) {
    if (opt && opt != undefined) {
      this.OptionZoomOutAnimation(opt, i, j);
    }
  }

  ngAfterViewChecked() {
    this.templatevolume(this.appModel.volumeValue, this);
  }

  OptionZoomOutAnimation(opt, i, j) {
    if (!this.checked && this.narrator.nativeElement.paused) {
      opt.imgsrc = opt.imgsrc_original;
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transform = "none";
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.transition = " ";
      this.optionsBlock.nativeElement.children[i].children[j].children[0].style.cursor = "";
    }
  }

  onClickoption(opt, i, j) {
    if (!this.narrator.nativeElement.paused || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      //this.count = 0;
      opt['isDisabled'] = true;
      opt['lowOpacity'] = true;
      // this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
      // this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
      this.appModel.enableSubmitBtn(true);
      // this.appModel.enableReplayBtn(false);
      if (this.feedback.correct_ans_index.includes(opt.id)) {
        this.noOfRightAnsClicked++;
        this.rightansArray.push(opt);
      } else {
        this.noOfWrongAnsClicked++;
        this.wrongansArray.push(opt);
      }
      this.appModel.notifyUserAction();
    }
  }

  blinkOnLastQues() {
    this.actComplete = true;
    if (this.appModel.isLastSectionInCollection) {
      this.appModel.blinkForLastQues(this.attemptType);
      this.appModel.stopAllTimer();
      if (!this.appModel.eventDone) {
        if (this.isLastQuesAct) {
          this.appModel.eventFired();
          this.appModel.event = { 'action': 'segmentEnds' };
        }
        if (this.isLastQues) {
          this.appModel.event = { 'action': 'end' };
        }
      }

    } else {
      this.appModel.moveNextQues(this.attemptType);
    }
  }


  ngOnInit() {
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    /*Start: Theme Implementation(Template Changes)*/
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.checkquesTab();
    /*End: Theme Implementation(Template Changes)*/
    this.appModel.globalJsonData.subscribe(data=>{
      this.showAnsTimeout = data.showAnsTimeout;
    });
    if (fetchedData.titleScreen) {
      this.quesInfo = fetchedData;
      this.noOfImgs = this.quesInfo.imgCount;
      if (this.quesInfo && this.quesInfo.titleScreen) {
        this.showIntroScreen = fetchedData.titleScreen;
      } else {
        this.showIntroScreen = false;
      }
    } else {
      this.setData();
    }
  
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.setFeedbackAudio(mode);
        }
      } else if (mode == "auto") {

        //show modal of auto
        this.attemptType = "";
        this.appModel.notifyUserAction();
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.checked = true;
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.confirmModalRef.nativeElement.classList = "modal";
          this.submitModalRef.nativeElement.classList = "modal";
          this.confirmReplayRef.nativeElement.classList = "modal";
          this.onlyOneAttemptModalRef.nativeElement.classList="modal";
          this.noOfRightAnsClicked = 0;
          this.noOfWrongAnsClicked = 0;
          this.setFeedbackAudio(mode);
        }
      }
    })


    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((action) => {
      this.appModel.notifyUserAction();
      if (action == "uttarDikhayein") {
        this.InstructionVo = false;
        if (!this.instruction.nativeElement.paused)
        {
          this.instruction.nativeElement.pause();
          this.instruction.nativeElement.currentTime = 0;
        }
        if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.confirmModalRef.nativeElement.classList = "displayPopup modal";
          this.checkForAutoClose();
          //check 
        }
      }
      if (action == "submitAnswer") {
        this.InstructionVo = false;
        if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
            }
        if (this.submitModalRef && this.submitModalRef.nativeElement) {
          this.submitModalRef.nativeElement.classList = "displayPopup modal";
        }
      }
      if (action == "replayVideo") {
        this.InstructionVo = false;
        if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
            }
        // this.appModel.videoStraming(true);
        if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
          $("#optionsBlock").addClass("disable_div");
          this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
          this.PlayPauseFlag = true;
          this.quesObj.quesPlayPause = this.quesObj.quesPause;
          this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
        }
      }
    })

    this.appModel.questionEvent.subscribe(() => {
      if (this.rightanspopUp) {
        console.log("timer still exist");
        clearTimeout(this.rightanspopUp);
      }
      if (this.wronganspopUp) {
        clearTimeout(this.wronganspopUp);
      }
    });

    this.appModel.nextBtnEvent().subscribe(() => {
      if (this.appModel.isLastSectionInCollection) {
        this.appModel.event = { 'action': 'segmentEnds' };
      }
      if (this.appModel.isLastSection) {
        this.appModel.event = { 'action': 'end' };
      }
    })

    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    })
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
  }

  ngOnDestroy() {
    /*Start: Theme Implementation(Template Changes)*/
    if(this.bgSubscription!=undefined){
      this.bgSubscription.unsubscribe();
    }
    if (this.confirmPopupSubscription != undefined) {
      this.confirmPopupSubscription.unsubscribe();
    }
    if (this.tempSubscription != undefined) {
      this.tempSubscription.unsubscribe();
    }
    this.narrator.nativeElement.pause();
		this.narrator.nativeElement.currentTime = 0;
    /*End: Theme Implementation(Template Changes)*/
  }

  checkForAutoClose() {
    if (this.confirmModalRef.nativeElement.classList.contains("displayPopup")) {
      if (this.isLastQuestion && this.actComplete) {
        this.resetTimerForAutoClose();
      } else {
        if (this.timerSubscription != undefined) {
          this.timerSubscription.unsubscribe();
        }
      }
    }
  }
  resetTimerForAutoClose() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    this.appModel.stopAllTimer();
    const interval = 1000;
    const closeConfirmInterval = 2 * 60;
    this.timerSubscription = timer(0, interval).pipe(
      take(closeConfirmInterval)
    ).subscribe(value =>
      this.removeSubscription((closeConfirmInterval - +value) * interval),
      err => {
        //console.log("error occuered....");
      },
      () => {
        this.sendFeedback('confirm-modal-id','no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  postWrongAttemplt() {
    this.resetAttempt();
    this.disableParent = true;
    setTimeout(() => {
      this.disableParent = false;
    },500);
  }

/*Start: Theme Implementation(Template Changes)*/
  checkquesTab() {
    if(this.fetchedcontent.commonassets.ques_control!=undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();      
    }
  }

/*End: Theme Implementation(Template Changes)*/


  templatevolume(vol, obj) {
    if (obj.narrator && obj.narrator.nativeElement) {
      obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackInfoAudio && obj.feedbackInfoAudio.nativeElement) {
      obj.feedbackInfoAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackPopupAudio && obj.feedbackPopupAudio.nativeElement) {
      obj.feedbackPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackpartialPopupAudio && obj.feedbackpartialPopupAudio.nativeElement) {
      obj.feedbackpartialPopupAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.mainVideo && obj.mainVideo.nativeElement) {
      obj.mainVideo.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.titleAudio && obj.titleAudio.nativeElement) {
      obj.titleAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.feedbackoneAttemptAudio && obj.feedbackoneAttemptAudio.nativeElement) {
      obj.feedbackoneAttemptAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.popupBodyRef && obj.popupBodyRef.nativeElement.children[0]) {
      if(this.currentAudioIndex!=undefined && obj.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex]!=undefined) {
        obj.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].volume = obj.appModel.isMute ? 0 : vol;
      }
    }
    if (obj.popupBodyRef && obj.popupBodyRef.nativeElement.children[1]) {
      if(this.currentAudioIndex!=undefined && obj.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex]!=undefined) {
        obj.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].volume = obj.appModel.isMute ? 0 : vol;
      }
    }
    //     if (this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex]) {
    //   if (!this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].paused) {
    //     this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].pause();
    //     this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].currentTime = 0;
    //   }
    // }
    // if (this.popupBodyRef.nativeElement.children[1]) {
    //   if (this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex]) {
    //     if (!this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].paused) {
    //       this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].pause();
    //       this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].currentTime = 0;
    //     }
    //   }
    // }
  }

  close() {
    //this.appModel.event = { 'action': 'exit', 'currentPosition': this.currentVideoTime };
    this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': 0 };
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

  checkVideoLoaded() {
    if (!this.videoReplayd) {
      this.appModel.setLoader(false);
      this.appModel.navShow = 1;
      this.isPlayVideo = true;
      this.appModel.isVideoPlayed = true;
      this.appModel.stopAllTimer();
    }
  }

  endedHandler() {
    if (!this.videoReplayd) {
      this.isPlayVideo = false;
      this.appModel.navShow = 2;
      this.appModel.setLoader(true);
      this.appModel.startPreviousTimer();
    }
  }


  endedHandleronSkip() {    
      this.isPlayVideo = false;   
      this.appModel.navShow = 2;  
      this.appModel.videoStraming(false);
      setTimeout(() => {
        if(this.checked) {
          $("#optionsBlock .options").css("opacity", "0.3");
          $("#optionsBlock .options").css("pointer-events", "none");
          $("#instructionBar").css("pointer-events", "none");
          $("#instructionBar").css("opacity", "0.3");
        }
      },500);
      this.appModel.notifyUserAction();   
  }


  PlayPauseVideo(){
    if(this.PlayPauseFlag)
    {
      this.mainVideo.nativeElement.pause();
      this.quesObj.quesPlayPause = this.quesObj.quesPlay;
      this.PlayPauseFlag = false;
    }
    else{
      this.mainVideo.nativeElement.play();
      this.quesObj.quesPlayPause = this.quesObj.quesPause;
      this.PlayPauseFlag = true;
    }
    
  }

    hoverPlayPause(){
    if(this.PlayPauseFlag)
    {    
      this.quesObj.quesPlayPause = this.quesObj.quesPauseHover;     
    }
    else{
      this.quesObj.quesPlayPause = this.quesObj.quesPlayHover;    
    }
  }

  leavePlayPause(){
    if(this.PlayPauseFlag)
    {   
      this.quesObj.quesPlayPause = this.quesObj.quesPauseOriginal;   
    }
    else{
      this.quesObj.quesPlayPause = this.quesObj.quesPlayOriginal; 
    }
  }

  hoverSkip(){
   // this.skipFlag = false;
   this.quesObj.quesSkip = this.quesObj.quesSkipHover;
  }
  houtSkip(){
    this.quesObj.quesSkip = this.quesObj.quesSkipOrigenal;
  }

  endedHandlerForTitle() {
    this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
  }

  showReplay(ref, flag: string, action?: string) {
    ref.classList = "modal";
    this.appModel.notifyUserAction();
    if (flag == "yes") {
      this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
      if (action == "replay") {
        this.quesSkip = true;
        //this.isPlayVideo = true;
        this.replayVideo();
      }
    } else if (flag == "no") {
      this.appModel.videoStraming(false);
      this.appModel.enableReplayBtn(true);
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        $("#optionsBlock").removeClass("disable_div");
      }, 1000);
    }
  }

  replayVideo() {
    this.videoReplayd = true;
    this.isPlayVideo = true;
    // this.appModel.enableSubmitBtn(false);
    $("#optionsBlock").addClass("disable_div");
    $(".instructionBase").addClass("disable_div");
    this.appModel.navShow = 1;
    //this.mainVideo.nativeElement.src = this.quesObj.quesVideo.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesVideo.urlOgv + "?someRandomSeed=" + Math.random().toString(36);
    setTimeout(() => {
      this.mainVideo.nativeElement.play();
      //this.appModel.stopAllTimer();
      this.mainVideo.nativeElement.onended = () => {
        //this.appModel.enableSubmitBtn(true);
        this.appModel.navShow = 2;
        this.isPlayVideo = false;
        this.appModel.videoStraming(false);
        this.disableParent = true;
        setTimeout(() => {
          if(this.checked) {
            $("#optionsBlock .options").css("opacity", "0.3");
            $("#optionsBlock .options").css("pointer-events", "none");
            $("#instructionBar").css("pointer-events", "none");
            $("#instructionBar").css("opacity", "0.3");
          }
        },500);
        setTimeout(() => {
          this.disableParent = false;
        },2000);
        // $("#optionsBlock .options").addClass("disable_div");
        // $(".instructionBase").addClass("disable_div");
        // setTimeout(() => {
        //   $("#optionsBlock .options").addClass("disable_div");
        //   $(".instructionBase").addClass("disable_div");
        // },1000);
        // setTimeout(() => {
        //   $("#optionsBlock .options").removeClass("disable_div");
        //   $(".instructionBase").removeClass("disable_div");
        // },2000);
        this.appModel.notifyUserAction();
      }
    }, 500)
  }

  checkforQVO() {
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
      // this.narrator.nativeElement.src = this.quesObj.quesInstruction.location == "content" ? this.containgFolderPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
      this.appModel.handlePostVOActivity(true);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
     // this.optionsBlock.nativeElement.classList = "row mx-0 disableDiv";
     this.disableDiv = true;
     this.disableSection=true;
     this.enableOption = true;
      this.narrator.nativeElement.play();
      this.narrator.nativeElement.onended = () => {
        this.appModel.handlePostVOActivity(false);
        this.appModel.enableReplayBtn(true);
        
        this.disableSection=false;
        setTimeout(() => {
         // alert();
         this.disableDiv = false;
        }, 1000);
        
      //  this.optionsBlock.nativeElement.classList = "row mx-0";
      }
    } else {
      this.appModel.handlePostVOActivity(false);
      this.appModel.enableReplayBtn(true);
    }
  }
  
  setData() {
    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      //let fetchedData: any = this.appModel.content.contentData.data;
      console.log(this.fetchedcontent);
      if (this.fetchedcontent && this.fetchedcontent.titleScreen) {
        this.showIntroScreen = true;
      } else {
        this.showIntroScreen = false;
        this.feedback = this.fetchedcontent.feedback;
        this.commonAssets = this.fetchedcontent.commonassets;
        this.narratorAudio = this.fetchedcontent.commonassets.narrator;
        //this.appModel.setQuesControlAssets(fetchedData.commonassets.ques_control);
        this.ques_control = this.fetchedcontent.commonassets.ques_control;
        this.noOfImgs = this.commonAssets.imgCount;
        this.isLastQuestion = this.commonAssets.isLastQues;
        this.isFirstQues = this.commonAssets.isFirstQues;
        this.isLastQues = this.appModel.isLastSection;
        this.isLastQuesAct = this.appModel.isLastSectionInCollection;
        if (this.isLastQuesAct || this.isLastQues) {
          this.appModel.setlastQuesNT();
        }
        this.optionObj = this.fetchedcontent.optionObj;
        this.optionCommonAssets = this.fetchedcontent.option_common_assets;
        console.log(this.optionCommonAssets);
        this.feedbackObj = this.fetchedcontent.feedback;
        this.correctImg = this.feedbackObj.popup_commmon_imgs.correctimg;
        this.incorrectImg = this.feedbackObj.popup_commmon_imgs.incorrectimg;
        this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
        this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
        this.infoPopupAssets = this.fetchedcontent.feedback.info_popup;
        this.oneAttemptPopupAssets = this.fetchedcontent.feedback.oneAttempt_popup;
        this.replayconfirmAssets = this.fetchedcontent.feedback.replay_confirm;
        this.submitPopupAssets = this.fetchedcontent.feedback.submit_popup;
        this.quesObj = this.fetchedcontent.quesObj;
        /*Start: Theme Implementation(Template Changes)*/
        this.controlHandler={
              isSubmitRequired:this.quesObj.submitRequired,
              isReplayRequired:this.quesObj.replayRequired
        }
        /*End: Theme Implementation(Template Changes)*/
        if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
          this.isPlayVideo = true;
          //sessionStorage.setItem("isPlayVideo", "true");
        } else {
          this.isPlayVideo = false;
        }
      }
    }

  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }

  onHoverZaariRakhein() {
    this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_hover;
  }
  onHoverOutZaariRakhein() {
    this.quesInfo.jariRakheinBtn = this.quesInfo.jariRakheinBtn_original;
  }

  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoveronSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_hover;
  }

  houtonSubmitConfirm() {
    this.submitPopupAssets.confirm_btn = this.submitPopupAssets.confirm_btn_original;
  }

  hoveronReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_hover;
  }

  houtonReplayConfirm() {
    this.replayconfirmAssets.confirm_btn = this.replayconfirmAssets.confirm_btn_original;
  }

  hoverinfopopupCloseConfirm() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_hover;
  }

  houtinfopopupCloseConfirm() {
    this.infoPopupAssets.close_btn = this.infoPopupAssets.close_btn_original;
  }


  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
  }

  hoveronSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_hover;
  }

  houtonSubmitDecline() {
    this.submitPopupAssets.decline_btn = this.submitPopupAssets.decline_btn_original;
  }

  hoveronReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_hover;
  }

  houtonReplayDecline() {
    this.replayconfirmAssets.decline_btn = this.replayconfirmAssets.decline_btn_original;
  }

  hoverCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
  }
  houtCloseConfirm() {
    this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
  }

  hoverClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_hover;
  }

  houtClosePopup() {
    this.feedbackObj.popup_commmon_imgs.close_btn = this.feedbackObj.popup_commmon_imgs.close_btn_original;
  }

  hoveroneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_hover;
  }

  houtoneAttemptClosePopup() {
    this.oneAttemptPopupAssets.close_btn = this.oneAttemptPopupAssets.close_btn_original;
  }

  hoversubmitCloseConfirm() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_hover;
  }

  houtsubmitCloseConfirm() {
    this.submitPopupAssets.close_btn = this.submitPopupAssets.close_btn_original;
  }

  hoveroneAttemptOK() {
   this.oneAttemptPopupAssets.ok_btn=this.oneAttemptPopupAssets.ok_btn_hover;
  }

  houtoneAttemptOK() {
    this.oneAttemptPopupAssets.ok_btn=this.oneAttemptPopupAssets.ok_btn_original;
  }

  hoverOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_hover;
  }

  houtOK() {
    this.infoPopupAssets.ok_btn = this.infoPopupAssets.ok_btn_original;
  }

  hoverreplayCloseConfirm() {
    this.replayconfirmAssets.close_btn = this.replayconfirmAssets.close_btn_hover;
  }

  houtreplayCloseConfirm() {
    this.replayconfirmAssets.close_btn = this.replayconfirmAssets.close_btn_original;
  }

  showFeedback(id: string, flag: string) {
    this.count = 0;
    this.attemptType = "manual";
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
    }
    if (id == "info-modal-id") {
      this.disableParent = true;
      this.infoModalRef.nativeElement.classList = "modal";
      setTimeout(() => {
        this.disableParent = false;
      },500);
      if (this.feedbackInfoAudio && !this.feedbackInfoAudio.nativeElement.paused) {
        this.feedbackInfoAudio.nativeElement.pause();
        this.feedbackInfoAudio.nativeElement.currentTime = 0;
      }
    }
    if (id == "oneAttempt-modal-id") {
      this.disableParent = true;
      this.onlyOneAttemptModalRef.nativeElement.classList = "modal";
      if (this.feedbackoneAttemptAudio && !this.feedbackoneAttemptAudio.nativeElement.paused) {
        this.feedbackoneAttemptAudio.nativeElement.pause();
        this.feedbackoneAttemptAudio.nativeElement.currentTime = 0;
      }
      setTimeout(() => {
        this.disableParent = false;
      },500);
    }
    if (flag == "yes") {
      if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        $("#optionsBlock .options").css("pointer-events", "none");
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'manual');
        }, 100);
      }
      if ((this.noOfRightAnsClicked < this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0 && this.noOfRightAnsClicked > 1) {
        this.infoModalRef.nativeElement.classList = "displayPopup modal";
        let partialFeedbackAudio = this.infoPopupAssets.partialCorrectAudio;
        // this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.src = partialFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackInfoAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 1) {
        $("#optionsBlock .options").css("pointer-events", "none");
        this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
        this.styleBodyPopup = this.feedbackObj.wrong_style_body;
        setTimeout(() => {
          this.appModel.invokeTempSubject('showModal', 'manual');
        }, 100);
      }
      if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
        this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        setTimeout(() => {
          $("#instructionBar").addClass("disable_div");
          this.partialpopupRef.nativeElement.classList = "displayPopup modal";
          this.setFeedbackAudio('');
        }, 100);
      }
      if ((this.noOfRightAnsClicked + this.noOfWrongAnsClicked) >= 0 && (this.noOfRightAnsClicked + this.noOfWrongAnsClicked) < 2) {
        this.onlyOneAttemptModalRef.nativeElement.classList = "displayPopup modal";
        let oneAttemptFeedbackAudio = this.oneAttemptPopupAssets.oneAttemptAudio;
        // this.feedbackoneAttemptAudio.nativeElement.src = oneAttemptFeedbackAudio.location == "content" ? this.containgFolderPath + "/" + oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackoneAttemptAudio.nativeElement.src = oneAttemptFeedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36); 
        this.feedbackoneAttemptAudio.nativeElement.play();
        this.appModel.notifyUserAction();
      }
    } else {
      this.appModel.notifyUserAction();
      this.disableDiv = true;
      setTimeout(() => {
        this.disableDiv = false;
     }, 1000);
    }
  }

  dontshowFeedback(id: string, flag: string) {
    this.disableParent = true;
    if (id == "submit-modal-id") {
      this.submitModalRef.nativeElement.classList = "modal";
      this.optionsBlock.nativeElement.classList = "row mx-0";
      this.appModel.notifyUserAction();
      //this.resetAttempt();
    }
    this.disableDiv = true;
    setTimeout(() => {
      this.disableDiv = false;
      this.disableParent = false;
   }, 500);
  }

  setFeedbackAudio(mode) {
    console.log(this.rightansArray);
    console.log(this.wrongansArray);
    if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
      this.checked = true;
      this.rightanspopUpheader_img = true;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = false;
      //this.mainmodalRef.nativeElement.src = this.containgFolderPath + "/" + this.feedbackObj.headerTxt_img.url;
      this.rightansArray.sort((a, b) => { return a.id - b.id; });
      if (this.noOfRightAnsClicked > 4) {
        this.rightansArray1 = this.rightansArray.slice(0, 4);
        this.rightansArray2 = this.rightansArray.slice(4, this.rightansArray.length);
        this.AnsObj = [this.rightansArray1, this.rightansArray2];
        this.Array2required = true;
      } else {
        this.ansArray1 = this.rightansArray.slice(0, this.rightansArray.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playFeedbackAudio(0, undefined, false);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      $("#instructionBar").css("opacity", "0.3");
    }
    if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = true;
      this.showanspopUpheader_img = false;
      this.wrongansArray.sort((a, b) => { return a.id - b.id; });
      if (this.noOfWrongAnsClicked > 4) {
        this.wrongansArray1 = this.wrongansArray.slice(0, 4);
        this.wrongansArray2 = this.wrongansArray.slice(4, this.wrongansArray.length);
        this.AnsObj = [this.wrongansArray1, this.wrongansArray2]
        this.Array2required = true;
      } else {
        this.ansArray1 = this.wrongansArray.slice(0, this.wrongansArray.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playFeedbackAudio(0, undefined, false);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
      // $("#optionsBlock .options").css("opacity", "unset");
      $("#optionsBlock").removeClass("disable_div");
    }
    if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked == 0) {
      console.log(this.rightAnspopupAssets);
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.appModel.resetBlinkingTimer();
      this.rightAnspopupAssets.sort((a, b) => { return a.id - b.id; });
      if (this.rightAnspopupAssets.length > 4) {
        this.rightansArray1 = this.rightAnspopupAssets.slice(0, 4);
        this.rightansArray2 = this.rightAnspopupAssets.slice(4, this.rightAnspopupAssets.length);
        this.AnsObj = [this.rightansArray1, this.rightansArray2]
        this.Array2required = true;
      } else {
        this.ansArray1 = this.rightAnspopupAssets.slice(0, this.rightAnspopupAssets.length);
        this.Array2required = false;
      }
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playrightFeedbackAudioPopup(0, mode);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(false);
      $("#optionsBlock .options").css("pointer-events", "none");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("pointer-events", "none");
      $("#instructionBar").css("opacity", "0.3");
    }
    if (this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked > 0) {
      this.partialpopupRequired = true;
      this.rightansArray.sort((a, b) => { return a.id - b.id; });
      this.wrongansArray.sort((a, b) => { return a.id - b.id; });
      let checkDom = setInterval(() => {
        clearInterval(checkDom);
        this.playrightFeedbackAudioforPartialPopup(0);
      }, 100);
      this.appModel.enableSubmitBtn(false);
      this.appModel.enableReplayBtn(true);
      // $("#optionsBlock .options").css("opacity", "unset");
      $("#optionsBlock").removeClass("disable_div");
      this.optionsBlock.nativeElement.classList = "row mx-0";
    }
  }
  playrightFeedbackAudioPopup(i, mode) {
    let current = i;
    if (this.rightansArray1.length > 0) {
      if (this.rightansArray1[i] && this.rightansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.rightansArray1[i].imgrightfeedback_audio;
        // this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current, mode);
        }
      } else {
        this.playrightFeedbackAudioPopupforSecondrow(0, mode);
      }
    } else {
      if (this.ansArray1[i] && this.ansArray1[i].imgrightfeedback_audio) {
        this.feedbackAudio = this.ansArray1[i].imgrightfeedback_audio;
        // this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.location == "content" ? this.containgFolderPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36) : this.assetsPath + "/" + this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
        console.log(this.feedbackPopupAudio.nativeElement.src);
        this.feedbackPopupAudio.nativeElement.play();
        if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[0].children[i]) {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
        }
        this.feedbackPopupAudio.nativeElement.onended = () => {
          //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          ++current;
          this.playrightFeedbackAudioPopup(current, mode);
        }
      } else {
        setTimeout(() => {
          console.log("play right feedback audio");
          if (this.count == 0 || mode == "manual" || (this.count == 1 && mode == "auto")) {
            this.closeModal();
            if (this.count == 1 && mode == "auto") {
              this.attemptType = "";
            }
            this.blinkOnLastQues();
            this.appModel.moveNextQues();
          }
        }, this.showAnsTimeout);
      }
    }

  }
  playrightFeedbackAudioPopupforSecondrow(i, mode) {
    let current = i;
    if (this.rightansArray2[i] && this.rightansArray2[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray2[i].imgrightfeedback_audio;
      this.feedbackPopupAudio.nativeElement.src = this.feedbackAudio.url + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackPopupAudio.nativeElement.src);
      this.feedbackPopupAudio.nativeElement.play();
      if (this.popupBodyRef && this.popupBodyRef.nativeElement && this.popupBodyRef.nativeElement.children[1].children[i]) {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackPopupAudio.nativeElement.onended = () => {
        this.popupBodyRef.nativeElement.children[1].children[i].classList.remove("optionAnimate");
        this.popupBodyRef.nativeElement.children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioPopupforSecondrow(current, mode);
      }
    } else {
      setTimeout(() => {
        console.log("playrightFeedbackAudioPopupforSecondrow");
        if (this.count == 0 || mode == "manual") {
          this.closeModal();
        }
      }, 500);
      this.blinkOnLastQues();
      this.appModel.moveNextQues();
    }
  }
  playrightFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.rightansArray[i] && this.rightansArray[i].imgrightfeedback_audio) {
      this.feedbackAudio = this.rightansArray[i].imgrightfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url  + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[0].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playrightFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        this.playwrongFeedbackAudioforPartialPopup(0);
      }, 1000);

    }
  }
  playwrongFeedbackAudioforPartialPopup(i) {
    let current = i;
    if (this.wrongansArray[i] && this.wrongansArray[i].imgwrongfeedback_audio) {
      this.feedbackAudio = this.wrongansArray[i].imgwrongfeedback_audio;
      this.feedbackpartialPopupAudio.nativeElement.src = this.feedbackAudio.url  + "?someRandomSeed=" + Math.random().toString(36);
      console.log(this.feedbackpartialPopupAudio.nativeElement.src);
      this.feedbackpartialPopupAudio.nativeElement.play();
      if (this.partialpopupBodyRef && this.partialpopupBodyRef.nativeElement && this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i]) {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options optionAnimate";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " optionAnimate";
      }
      this.feedbackpartialPopupAudio.nativeElement.onended = () => {
        //this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList = "options";
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.remove("optionAnimate");
        this.partialpopupBodyRef.nativeElement.children[1].children[1].children[i].classList.value += " nutralize";
        ++current;
        this.playwrongFeedbackAudioforPartialPopup(current);
      }
    } else {
      setTimeout(() => {
        console.log("playwrongFeedbackAudioforPartialPopup");
        if (this.count == 0) {
          this.closeModal();
        }
      }, 500)
    }
  }
  resetAttempt() {
    this.count = 1;
    this.noOfRightAnsClicked = 0;
    this.noOfWrongAnsClicked = 0;
    this.rightansArray = [];
    this.wrongansArray = [];
    this.rightansArray1 = [];
    this.rightansArray2 = [];
    this.wrongansArray1 = [];
    this.wrongansArray2 = [];
    this.ansArray1 = [];
    this.AnsObj = [];
    this.optionObj.forEach(optArr => {
      optArr.optionsArr.forEach(opt => {
        if(opt.isDisabled) {
          opt.isDisabled = false;
        }
        if(opt.lowOpacity) {
          opt.lowOpacity = false;
        }
      })
    });
  }
  playFeedbackAudio(i, j, flag) {
    this.currentAudioIndex = i;
    if (this.popupBodyRef.nativeElement.children[0].children[i] != undefined && !flag) {
      if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src = this.ansArray1[i].imgrightfeedback_audio.url;
        }

        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src =  this.AnsObj[0][i].imgrightfeedback_audio.url;
        }
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          if (this.ansArray1.length > 0) {
            //this.popupBodyRef.nativeElement.children[0].children[i].classList = "options optionsWidth";
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          if (this.AnsObj.length > 0) {
            this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          }
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
      if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
        $("#optionsBlock").removeClass("disableDiv");
        $("#optionsBlock .options").css("pointer-events", "unset");
        if (this.ansArray1.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate optionsWidth";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src =  this.ansArray1[i].imgwrongfeedback_audio.url;
        }
        if (this.AnsObj.length > 0) {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " optionAnimate";
          this.popupBodyRef.nativeElement.children[0].children[i].children[1].src =  this.AnsObj[0][i].imgwrongfeedback_audio.url;
        }

        this.popupBodyRef.nativeElement.children[0].children[i].children[1].load();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].play();
        this.popupBodyRef.nativeElement.children[0].children[i].children[1].onended = () => {
          this.popupBodyRef.nativeElement.children[0].children[i].classList.remove("optionAnimate");
          this.popupBodyRef.nativeElement.children[0].children[i].classList.value += " nutralize";
          i++;
          this.playFeedbackAudio(i, undefined, false);
        }
      }
    }
    else if (this.noOfRightAnsClicked > 4 || this.noOfWrongAnsClicked > 4) {
      flag = true;
      if (j == undefined) {
        j = 0;
      }
      this.currentAudioIndex = j;
      $("#optionsBlock").removeClass("disableDiv");
      if (this.popupBodyRef.nativeElement.children[1].children[j] != undefined && flag) {
        //this.popupBodyRef.nativeElement.children[1].children[j].classList = "options optionAnimate";
        this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " optionAnimate";
        if ((this.noOfRightAnsClicked == this.feedback.correct_ans_index.length) && this.noOfWrongAnsClicked == 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src =  this.AnsObj[1][j].imgrightfeedback_audio.url;
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            //this.popupBodyRef.nativeElement.children[1].children[j].classList = "options";
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
        if (this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0) {
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].src = this.AnsObj[1][j].imgwrongfeedback_audio.url;

          this.popupBodyRef.nativeElement.children[1].children[j].children[1].load();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].play();
          this.popupBodyRef.nativeElement.children[1].children[j].children[1].onended = () => {
            this.popupBodyRef.nativeElement.children[1].children[j].classList.remove("optionAnimate");
            this.popupBodyRef.nativeElement.children[1].children[j].classList.value += " nutralize";
            j++;
            this.playFeedbackAudio(j, j, true);
          }
        }
      } else {
        setTimeout(() => {
          console.log("playFeedbackAudio1");
          if (this.count == 0) {
            this.closeModal();
          }
        }, 500);
      }

    } else {
      setTimeout(() => {
        if (!(this.noOfRightAnsClicked == 0 && this.noOfWrongAnsClicked > 0)) {
          if (!this.checked) {
            this.attemptType = "";
          }
          this.blinkOnLastQues();
        }
        console.log("playFeedbackAudio2");
        if (this.count == 0) {
          this.closeModal();
        }
      }, 500);
      //this.blinkOnLastQues();
    }
  }
  sendFeedback(id: string, flag: string) {
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    this.attemptType = "auto";
    this.confirmModalRef.nativeElement.classList = "modal";
    if(flag != "no") {
      this.noOfRightAnsClicked = 0;
      this.noOfWrongAnsClicked = 0;
    }
    if (flag == "yes") {
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      setTimeout(() => {
        this.appModel.invokeTempSubject('showModal', 'manual');
      }, 100);

      $("#instructionBar").addClass("disable_div");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("opacity", "0.3");
      this.checked = true;
    } else {
      this.disableParent = true;
      this.appModel.notifyUserAction();
      $("#instructionBar").removeClass("disable_div");
      this.disableDiv = true;
      setTimeout(() => {
        this.disableDiv = false;
        this.disableParent = false;
     }, 500);
    }
  }

  closeModal() {
    this.disableDiv = true;
    if (this.feedbackPopupAudio && !this.feedbackPopupAudio.nativeElement.paused) {
      this.feedbackPopupAudio.nativeElement.pause();
      this.feedbackPopupAudio.nativeElement.currentTime = 0;
    }
    if (this.popupBodyRef.nativeElement.children[0] && this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex]) {
      if (!this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].paused) {
        this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].pause();
        this.popupBodyRef.nativeElement.children[0].children[this.currentAudioIndex].children[1].currentTime = 0;
      }
    }
    if (this.popupBodyRef.nativeElement.children[1]) {
      if (this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex]) {
        if (!this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].paused) {
          this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].pause();
          this.popupBodyRef.nativeElement.children[1].children[this.currentAudioIndex].children[1].currentTime = 0;
        }
      }
    }
    if (this.feedbackpartialPopupAudio && !this.feedbackpartialPopupAudio.nativeElement.paused) {
      this.feedbackpartialPopupAudio.nativeElement.pause();
      this.feedbackpartialPopupAudio.nativeElement.currentTime = 0;
    }
    this.popupRef.nativeElement.classList = "modal";
    this.partialpopupRef.nativeElement.classList = "modal";
    this.infoModalRef.nativeElement.classList = "modal";
    //this.resetAttempt();
    if (!this.checked) {
      this.appModel.wrongAttemptAnimation();
    }
    if (!(this.noOfRightAnsClicked > 0 && this.noOfWrongAnsClicked == 0)) {
      this.resetAttempt();
    }
    this.appModel.notifyUserAction();

    if (this.checked) {
      this.optionsBlock.nativeElement.style.pointerEvents = "none";
      this.blinkOnLastQues();
    }

    if (!this.checked) {
      //alert();
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        this.disableDiv = false;
      }, 3000);
    }

  }
}


