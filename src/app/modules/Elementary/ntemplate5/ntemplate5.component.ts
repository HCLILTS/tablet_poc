import { Component, OnInit, HostListener, ViewChild, OnDestroy, AfterViewChecked } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { Subject, Observable, Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
// import { subscriptionLogsToBeFn } from 'rxjs/testing/TestScheduler';
import { ThemeConstants } from '../../../common/themeconstants';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';
import 'jquery';
declare var $: any;

@Component({
  selector: 'app-ntemplate5',
  templateUrl: './ntemplate5.component.html',
  styleUrls: ['./ntemplate5.component.scss']
})
export class NTemplate5Component implements OnInit , OnDestroy, AfterViewChecked{
  private appModel: ApplicationmodelService;
  constructor(appModel: ApplicationmodelService,private Sharedservice: SharedserviceService) {
    this.appModel = appModel;
    this.assetsPath = this.appModel.assetsfolderpath;
    this.appModel.navShow = 2;
    this.appModel.setLoader(true);
    // if error occured during image loading loader wil stop after 5 seconds 
    this.loaderTimer = setTimeout(() => {
      this.appModel.setLoader(false);
      this.checkforQVO();
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
  @ViewChild('popupRef') popupRef: any;
  @ViewChild('popupImage') popupImage: any;
  @ViewChild('rightFeedbackVO') rightFeedbackVO: any
  @ViewChild('wrongFeedbackVO') wrongFeedbackVO: any;
  
  audio = new Audio();
  blink: boolean = false;
  currentIdx = 0;
  commonAssets: any = "";
  optionslist: any = [];
  optionslist_main: any = "";
  myoption: any = [];
  question: any = "";
  feedback: any = "";
  narratorAudio: any;
  isLastActivity: any = "";
  checked: boolean = false;
  selected: boolean = false;
  bool: boolean = false;
  showIntroScreen: boolean;

  helpAudio: any = "";
  correctOpt: any;
  idArray: any = [];
  isFirstQues: boolean;
  isLastQues: boolean = false;
  isAutoplayOn: boolean;
  isLastQuesAct: boolean;

  noOfImgs: number;
  noOfImgsLoaded: number = 0;
  loaderTimer: any;
  disableHelpBtn: boolean = false;
  containgFolderPath: string = "";
  assetsPath: string = "";
  loadFlag: boolean = false;
  optionObj: any;
  optArr1: any;
  optArr2: any;
  optionCommonAssets: any;
  ques_control: any;
  feedbackObj: any;
  popupAssets: any;
  confirmPopupAssets: any;
  noOfRightAns: any;
  rightAnspopupAssets: any;
  tempSubscription: Subscription;
  bgSubscription: Subscription;
  rightanspopUp: any;
  wronganspopUp: any;
  backgroundAssets:any;
  quesObj: any;
  attemptType: string = "";
  count: number = 0;
  rightanspopUpheader_img: boolean = false;
  wronganspopUpheader_img: boolean = false;
  showanspopUpheader_img: boolean = false;
  styleHeaderPopup:any;
  styleBodyPopup:any;
  controlHandler = {
		isSubmitRequired:false,
    isReplayRequired:false
   };
  //themePath:any = "";
  themePath:any;
   fetchedcontent:any;
   functionalityType:any;
   InstructionVo:boolean=false;
   showAnsTimeout:number;
  disableSection: boolean = false;
  confirmPopupSubscription: any;
  timerSubscription: Subscription;
  isLastQuestion: boolean;
  actComplete: boolean = false;
  closeModalTimer1: any;
  closeModalTimer2: any;

  playHoverInstruction() {
    if (!this.narrator.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.appModel.notifyUserAction();
      console.log("play on Instruction");
      //this.instruction.nativeElement.load();
      if (this.instruction.nativeElement.paused && this.quesObj.quesInstruction.url!="") {
        
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.play();
        this.InstructionVo = true;
        
        this.instruction.nativeElement.onended = () => {
          //  this.disableSection=false;
            this.InstructionVo = false;
           }
      }else{
        this.InstructionVo = false;
      }
      if (!this.optionAudio.nativeElement.paused) {
        this.instruction.nativeElement.currentTime = 0;
        this.instruction.nativeElement.pause();
      }
  }
  }

  optionHover(opt, i, j) {
    $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleInAnimation");
  }

  onHoverOption(opt, i, j) {
    if (opt && opt != undefined) {
      if (this.narrator.nativeElement.paused) {
        $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleInAnimation");
        }
    }
  }

  playHoverOption(opt, i, j) {
    this.InstructionVo = false;
    this.appModel.notifyUserAction();
    if (this.optionsBlock.nativeElement.children[i].children[j].children[1].paused && this.narrator.nativeElement.paused) {
      this.optionsBlock.nativeElement.children[i].children[j].children[1].src = opt.imgsrc_audio.url;
      this.optionsBlock.nativeElement.children[i].children[j].children[1].load();
      if (!this.instruction.nativeElement.paused) {
        this.instruction.nativeElement.pause();
      }
      
      this.optionsBlock.nativeElement.children[i].children[j].children[1].volume = this.appModel.isMute ? 0 : this.appModel.volumeValue
      this.optionsBlock.nativeElement.children[i].children[j].children[1].play();
      if (i == 0) {
        if (this.optionsBlock.nativeElement.children[1] != undefined) {
          this.optionsBlock.nativeElement.children[1].style.pointerEvents = "none";
        }
      } else {
        if (this.optionsBlock.nativeElement.children[0] != undefined) {
          this.optionsBlock.nativeElement.children[0].style.pointerEvents = "none";
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
        } else {
          if (this.optionsBlock.nativeElement.children[0] != undefined) {
            this.optionsBlock.nativeElement.children[0].style.pointerEvents = "";
          }
        }
        for (let x = 0; x < this.optionsBlock.nativeElement.children[i].children.length; x++) {
          if (x != j) {
            this.optionsBlock.nativeElement.children[i].children[x].style.pointerEvents = "";
          }
        }
      } 
      this.onHoverOption(opt, i, j);
    }
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
      $(this.optionsBlock.nativeElement.children[i].children[j]).addClass("scaleOutAnimation");
      setTimeout(() => {
        $(this.optionsBlock.nativeElement.children[i].children[j]).removeClass("scaleInAnimation");
        $(this.optionsBlock.nativeElement.children[i].children[j]).removeClass("scaleOutAnimation");
      }, 500);
     }
  }
  checkAnswer(opt, i, j) {
    if (!this.narrator.nativeElement.paused || !this.instruction.nativeElement.paused) {
      console.log("narrator/instruction voice still playing");
    } else {
      this.optionsBlock.nativeElement.className += " disable_div";
      if (opt.id == this.feedback.correct_ans_index) {
        this.attemptType = "manual";
        this.checked = true;
        this.selected = true;
        this.rightanspopUpheader_img = true;
        this.wronganspopUpheader_img = false;
        this.showanspopUpheader_img = false;
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        this.optionsBlock.nativeElement.className += " disable_div";
        $("#instructionBar").addClass("disable_div");
        this.popupImage.nativeElement.src = opt.imgsrc.url;
        this.rightanspopUp=setTimeout(() => {
          this.popupRef.nativeElement.classList = "displayPopup modal";
          $("#optionsBlock .options").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
          this.rightFeedbackVO.nativeElement.src = opt.imgrightfeedback_audio.url;
            this.rightFeedbackVO.nativeElement.play();
          
        }, 700);
        this.rightFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            if (this.count == 0) {
              this.closeModal();
            }
          },2000);
        }
        
      } else {
        this.checked = true;
        this.selected = false;
        this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
        this.styleBodyPopup = this.feedbackObj.wrong_style_body;
        this.rightanspopUpheader_img = false;
        this.wronganspopUpheader_img = true;
        this.showanspopUpheader_img = false;
         this.optionsBlock.nativeElement.children[i].children[j].className += " disable_div";
        $("#instructionBar").addClass("disable_div");
        this.popupImage.nativeElement.src =  opt.imgsrc.url;
        this.wronganspopUp=setTimeout(() => {
          //this.appModel.openModal("success-modal-id", this.popupAssets,'');
          this.popupRef.nativeElement.classList = "displayPopup modal";
          
          this.optionsBlock.nativeElement.classList.value = "row mx-0";
          this.optionsBlock.nativeElement.children[i].children[j].style = "opacity:0.3";
          this.wrongFeedbackVO.nativeElement.src = opt.imgwrongfeedback_audio.url;
          this.wrongFeedbackVO.nativeElement.play();
        },700);
        
        this.checked = false;
        this.wrongFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            if (this.count == 0) {
              this.closeModal();
            }
         }, 2000);        
        }
      }
      this.optionsBlock.nativeElement.children[i].children[j].style.transform = "none";
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
    
    this.appModel.functionone(this.templatevolume,this);
    if (this.appModel.isNewCollection) {
      this.appModel.event = { 'action': 'segmentBegins' };
    }
    this.containgFolderPath = this.getBasePath();
    let fetchedData: any = this.appModel.content.contentData.data;
    this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
    this.functionalityType = this.appModel.content.contentLogic.functionalityType;
    this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/'+ this.fetchedcontent.theme_name ; 
    this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
    this.checkquesTab();
    this.appModel.globalJsonData.subscribe(data=>{
      this.showAnsTimeout = data.showAnsTimeout;
    });
    if (this.rightFeedbackVO != undefined || this.wrongFeedbackVO != undefined) {
      this.rightFeedbackVO.nativeElement.pause();
      this.rightFeedbackVO.nativeElement.currentTime = 0;
      this.rightFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.src = "";
      this.wrongFeedbackVO.nativeElement.pause();
      this.wrongFeedbackVO.nativeElement.currentTime = 0;
    }
    if(this.appModel.theme_name){
      this.bgSubscription = this.appModel.getActiveBG().subscribe(data=>{
        this.themePath = this.appModel.getPath("tabs");
        if(data && data.url && this.themePath){
          this.commonAssets.background = data
        }
      })
    }

    this.setData();
    this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
      if (mode == "manual") {
        //show modal for manual
        this.appModel.notifyUserAction();
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.popupRef.nativeElement.classList = "displayPopup modal";
          
          //this.setFeedbackAudio();
        }
      } else if (mode == "auto") {
        this.checked = true;
        //show modal of auto
        this.appModel.notifyUserAction();
        this.styleHeaderPopup = this.feedbackObj.style_header;
        this.styleBodyPopup = this.feedbackObj.style_body;
        if (this.popupRef && this.popupRef.nativeElement) {
          $("#instructionBar").addClass("disable_div");
          this.rightanspopUpheader_img = false;
          this.wronganspopUpheader_img = false;
          this.showanspopUpheader_img = true;
          this.popupRef.nativeElement.classList = "displayPopup modal";
          this.confirmModalRef.nativeElement.classList = "modal";
          $("#optionsBlock .options").css("opacity", "0.3");
          $("#instructionBar").css("opacity", "0.3");
          if (!this.rightFeedbackVO.nativeElement.paused || !this.wrongFeedbackVO.nativeElement.paused || !this.narrator.nativeElement.paused || !this.instruction.nativeElement.paused || !this.optionAudio.nativeElement.paused) {
            this.rightFeedbackVO.nativeElement.pause();
            this.wrongFeedbackVO.nativeElement.pause();
            this.narrator.nativeElement.pause();
            this.instruction.nativeElement.pause();
            this.optionAudio.nativeElement.pause();
          }
          this.popupImage.nativeElement.src = this.rightAnspopupAssets.imgsrc.url;
          this.rightFeedbackVO.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.url;
          this.rightFeedbackVO.nativeElement.play();
          this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
          $("#instructionBar").addClass("disable_div");
        }
        this.rightFeedbackVO.nativeElement.onended = () => {
          setTimeout(() => {
            if (this.count == 0) {
              this.closeModal();
            }
          }, 2000);

          this.blinkOnLastQues();
          this.appModel.moveNextQues();
        }
 }
    })

    this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe(() => {
      this.appModel.notifyUserAction();
      if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
        if (!this.instruction.nativeElement.paused)
            {
              this.instruction.nativeElement.pause();
              this.instruction.nativeElement.currentTime = 0;
              this.InstructionVo = false;
            }
        $("#instructionBar").addClass("disable_div");
        this.confirmModalRef.nativeElement.classList = "displayPopup modal";
        this.checkForAutoClose();
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
    });

    this.appModel.postWrongAttempt.subscribe(() => {
      this.postWrongAttemplt();
    });
    this.appModel.resetBlinkingTimer();
    this.appModel.handleController(this.controlHandler);
   
  }
  
  checkquesTab() {
    if(this.fetchedcontent.commonassets.ques_control!=undefined) {
      this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
    } else {
      this.appModel.getJson();      
    }
  }

  postWrongAttemplt() {
    $("#optionsBlock .options").removeClass("disable_div");
    $("#optionsBlock .options").css("opacity", "unset");
    this.count = 0;
  }


  templatevolume(vol,obj) {
    if(obj.narrator && obj.narrator.nativeElement){
        obj.narrator.nativeElement.volume = obj.appModel.isMute?0:vol;
    }
    if (obj.optionAudio && obj.optionAudio.nativeElement) {
      obj.optionAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.rightFeedbackVO && obj.rightFeedbackVO.nativeElement) {
      obj.rightFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.wrongFeedbackVO && obj.wrongFeedbackVO.nativeElement) {
      obj.wrongFeedbackVO.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
    if (obj.instruction && obj.instruction.nativeElement) {
      obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
    }
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

  checkforQVO(){
    if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.url+"?someRandomSeed="+ Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.narrator.nativeElement.play();
      this.disableSection=true;
      this.InstructionVo = true;
			this.narrator.nativeElement.onended = () => {
              this.appModel.handlePostVOActivity(false);
              setTimeout(() => {
               this.disableSection=false;
               this.InstructionVo = false;
               }, 1000);
             
			}
		} else {
			this.appModel.handlePostVOActivity(false);
		}
	}

  setData() {

    if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
      //let fetchedData: any = this.appModel.content.contentData.data;
      console.log(this.fetchedcontent);
      this.feedback = this.fetchedcontent.feedback;
      this.commonAssets = this.fetchedcontent.commonassets;
      this.narratorAudio = this.fetchedcontent.commonassets.narrator;
      this.ques_control = this.fetchedcontent.commonassets.ques_control;
      this.noOfImgs = this.commonAssets.imgCount;
      this.isFirstQues = this.commonAssets.isFirstQues;
      this.isLastQues = this.appModel.isLastSection;
      this.isLastQuestion = this.commonAssets.isLastQues;
      this.isLastQuesAct = this.appModel.isLastSectionInCollection;
      if (this.isLastQuesAct || this.isLastQues) {
        this.appModel.setlastQuesNT();
      }
      this.optionObj = this.fetchedcontent.optionObj;
      this.optionCommonAssets = this.fetchedcontent.option_common_assets;
      console.log(this.optionCommonAssets);
      this.feedbackObj = this.fetchedcontent.feedback;
      this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
      this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
      this.quesObj = this.fetchedcontent.quesObj;
      this.controlHandler={
         isSubmitRequired:this.quesObj.submitRequired,
         isReplayRequired:this.quesObj.replayRequired
      }
    }
    if(this.quesObj.quesInstruction.url==""){
       this.InstructionVo=false;
    }
  }

  getBasePath() {
    if (this.appModel && this.appModel.content) {
      return this.appModel.content.id + '';
    }
  }
  hoverConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
  }

  houtConfirm() {
    this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
  }

  hoverDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
  }

  houtDecline() {
    this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
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

  sendFeedback(id: string, flag: string) {
    if (this.timerSubscription != undefined) {
      this.timerSubscription.unsubscribe();
    }
    clearTimeout(this.closeModalTimer1);
    clearTimeout(this.closeModalTimer2);
    this.confirmModalRef.nativeElement.classList = "modal";
    this.attemptType = "auto";
    if (flag == "yes") {
      this.rightanspopUpheader_img = false;
      this.wronganspopUpheader_img = false;
      this.showanspopUpheader_img = true;
      this.styleHeaderPopup = this.feedbackObj.style_header;
      this.styleBodyPopup = this.feedbackObj.style_body;
      this.appModel.resetBlinkingTimer();
      // setTimeout(() => {
      this.appModel.invokeTempSubject('showModal', 'manual');
      this.popupImage.nativeElement.src = this.rightAnspopupAssets.imgsrc.url;
      this.rightFeedbackVO.nativeElement.src = this.rightAnspopupAssets.imgrightfeedback_audio.url;
      this.rightFeedbackVO.nativeElement.play();
      // }, 100);
      this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
      $("#instructionBar").addClass("disable_div");
      $("#optionsBlock .options").css("opacity", "0.3");
      $("#instructionBar").css("opacity", "0.3");
      this.checked = true;
      this.rightFeedbackVO.nativeElement.onended = () => {
        this.closeModalTimer1 = setTimeout(() => {
          if (this.count == 0) {
            this.closeModal();
            this.appModel.moveNextQues();
          }
        }, this.showAnsTimeout);
        //this.blinkOnLastQues();
        this.closeModalTimer2 = setTimeout(() => {
           this.closeModal();
           this.appModel.moveNextQues();
         }, this.showAnsTimeout);
        
        this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
        $("#instructionBar").addClass("disable_div");
        this.appModel.notifyUserAction();
      }
    } else {
      this.appModel.notifyUserAction();
      $("#optionsBlock").addClass("disable_div");
      if(!this.checked) {
        $("#instructionBar").removeClass("disable_div");
      }
       setTimeout(() => {
        if(!this.checked) {
          $("#optionsBlock").removeClass("disable_div");
         }
      }, 1000);
    }
  }

  ngOnDestroy() {
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
    clearTimeout(this.closeModalTimer1);
    clearTimeout(this.closeModalTimer2);
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
        this.sendFeedback('confirm-modal-id', 'no');
        this.timerSubscription.unsubscribe();
      }
    )
  }
  removeSubscription(timer) {
    console.log("waiting for autoClose", timer / 1000);
  }

  closeModal() {  
    $("#optionsBlock").addClass("disable_div");
    this.count = 1;
    if (!this.rightFeedbackVO.nativeElement.paused) {
      this.rightFeedbackVO.nativeElement.pause();
      this.rightFeedbackVO.nativeElement.currentTime = 0;
    }
    if (!this.wrongFeedbackVO.nativeElement.paused) {
      this.wrongFeedbackVO.nativeElement.pause();
      this.wrongFeedbackVO.nativeElement.currentTime = 0;
    }
    this.popupRef.nativeElement.classList = "modal";
    if (!this.checked) {
      this.appModel.wrongAttemptAnimation();
    }
    this.appModel.notifyUserAction();
    if (this.checked) {
      this.blinkOnLastQues();
    }
    if (!this.checked) {
      setTimeout(() => {
        $("#instructionBar").removeClass("disable_div");
        
        $("#optionsBlock").removeClass("disable_div");
      }, 3000);
      $("#optionsBlock .options").removeClass("disable_div");
      $("#optionsBlock .options").css("opacity", "unset");
    }
    }
  }
