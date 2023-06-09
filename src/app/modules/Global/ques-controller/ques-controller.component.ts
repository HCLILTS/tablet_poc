import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'quesCtrl',
  templateUrl: 'ques-controller.component.html',
  styleUrls: ['ques-controller.component.scss'],
})

export class QuesControllerComponent implements OnInit,OnDestroy {
  @ViewChild("quesBlockChild") quesBlockChild: any;
  @ViewChild('nextBtn') nextBtn: any;
  @ViewChild('ansBtnElem') ansBtnElem: any;
  @ViewChild('replayBtnElem') replayBtnElem: any;
  @ViewChild('submitBtnElem') submitBtnElem: any;
  @ViewChild('nextBtnEle') nextBtnEle: any;
  @ViewChild('prevBtnEle') prevBtnEle: any;
  appModel: ApplicationmodelService;
  subscriptionQuesNos: Subscription;
  subscriptionQuesIndex: Subscription;
  subscriptionControlAssets: Subscription;
  firstQusubscription: Subscription;
  blinkerSubscription: Subscription;
  // CommonSubscription: Subscription;
  ThemeSubscription: Subscription;
  controlAssets: any;
  isFirstQuestion: any = false;
  subcriptionUttarDikhayein: Subscription;
  assetsPath: any;
  containgFolderPath: any;
  quesTabs: any = [];
  quesCtrl: any;
  timeInterval: any;
  hideShowAnswer: boolean = true;
  disablePrev: boolean = true;
  disableNext: boolean = true;
  disableTabs: boolean = true;
  EVA: boolean = false;
  EnableShowAnswer: boolean = false;
  EnableSubmitAnswer: boolean = false;
  Template: any;
  EVAQid: any;
  subscription: Subscription;
  UttarDikhayeinTooltip: any;
  SubmitBtnTooltip: any;
  blink: any;
  themePath: any;
  themeType: any;
  buttonPath: any;
  disableSubmit: boolean = true;
  disableReplay: boolean;
  pointObjArr: any[] = [];
  questionNo: number = 0;
  noOfQues: number;
  disableUttarDikhayeinBtn: boolean = true;
  inactiveUserTimer1: number = 5;
  blinkFlag: boolean = false;
  enableSubmitBtn: boolean = false;
  enableReplayBtn: boolean = false;
  enableNavBtns: boolean = false;
  isVideoPlaying: boolean = false;
  isLastQuesAageyBadhe: boolean = false;
  isLastQues: boolean = false;
  ReplaybtnFromContent: boolean = false;
  tempReplayBtn: any;
  showAnsState: string = '';
  disableAageBadhey: boolean = false

  constructor(appModel: ApplicationmodelService, private Sharedservice: SharedserviceService) {
    this.appModel = appModel;

    this.subscription = this.Sharedservice.getData().subscribe(data => {
      this.Template = data.data.TemplateType;
      if (this.Template === 'EVA') {
        this.EVA = true;
      } else {
        this.EVA = false;
      }

    });



  }

  ngOnInit() {
    if (sessionStorage.getItem("tabsVisited")) {
      sessionStorage.removeItem("tabsVisited");
    }
    this.subscriptionQuesNos = this.appModel.getNoOfQues().subscribe(num => {
      console.log("number of questions", num);
      this.noOfQues = num;
      this.pointObjArr.splice(0, this.pointObjArr.length);
      for (let i = 0; i < 8; i++) {
        const obj = { "disabled": true, index: -1 };
        if (i < num) {
          obj.disabled = false;
        }
        obj.index = i;
        this.pointObjArr.push(obj);
      }
    })
    this.subscriptionQuesIndex = this.appModel.getQuesionIdx().subscribe(idx => {
      this.questionNo = idx;
      console.log("selected question index", this.questionNo);
    })




    // **** Disable aagey badhe button while on last question
    this.subscriptionControlAssets = this.appModel.getQuesControlAssets().subscribe(controlAssets => {
      console.log("controlAssets", controlAssets);
      this.quesCtrl = controlAssets;
      if (!this.EVA && this.ReplaybtnFromContent && this.quesCtrl) {
        this.quesCtrl.replay_btn = this.tempReplayBtn.replay_btn;
        this.quesCtrl.replay_btn_hover = this.tempReplayBtn.replay_btn_hover;
        this.quesCtrl.replay_btn_original = this.tempReplayBtn.replay_btn_original;
      }
      this.isLastQues = this.quesCtrl.isLastQues;
      if (this.isLastQues) {
        this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_disabled;
      }


      //*********  Move to next segment after 5 min of last question attempt */
      this.Sharedservice.getTimerOnLastQues().subscribe(data => {
        if (data.data && this.EVA && !this.appModel.nextSectionTimer) {
          this.appModel.nextSectionTimer = setTimeout(() => {
            this.appModel.nextSectionEVA(this.isLastQues);
          }, 5 * 60 * 1000);
        }
      });


      // **** Enable show answer button
      this.subscription = this.Sharedservice.getShowAnsEnabled().subscribe(data => {
        this.EnableShowAnswer = data.data;
        if (this.EnableShowAnswer === true) {
          this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
          this.UttarDikhayeinTooltip = "उत्तर दिखाएँ";
          this.showAnsState = 'active';
        } else {
          this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
          this.UttarDikhayeinTooltip = "";
          this.showAnsState = 'inActive';
        }
      });
      this.Sharedservice.getShowAnsClickDisabled().subscribe(data => {
        if (this.showAnsState === 'active') {
          this.EnableShowAnswer = !data.data;
        }
      });
      if (this.EVA) {
        for (let i = 0; i < 5; i++) {
          if (i > this.noOfQues - 1) {  // disabled question tab
            this.quesTabs[i] = this.quesCtrl.quesTabs["tabCircleDisabled"];
          }
          else {
            this.quesTabs[i] = this.quesCtrl.quesTabs["tabCircleUnVisited"];
          }
          if (sessionStorage.getItem("tabsVisited")) {  // tabs for which answer is given once
            let visitedTabArr = JSON.parse(sessionStorage.getItem("tabsVisited"));
            if (visitedTabArr.indexOf(i) > -1) {
              this.quesTabs[i] = this.quesCtrl.quesTabs["tabCircleVisited"];
            }
          }
          if (i == this.questionNo) { //current question tab
            this.quesTabs[i] = this.quesCtrl.quesTabs["tabCircleActive"];
          }
        }
      } else {
        if (this.quesCtrl.quesTabs != undefined) {
          this.quesTabs = this.quesCtrl.quesTabs.slice(0, this.noOfQues);
        }
      }


      // Enable DIsable submit button
      this.subscription = this.Sharedservice.getSubmitAnsEnabled().subscribe(data => {
        this.EnableSubmitAnswer = data.data;
        if (this.EnableSubmitAnswer === true) {
          this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_original;
          this.SubmitBtnTooltip = "उत्तर दिखाएँ!";
        } else {
          this.quesCtrl.submit_btn = this.quesCtrl.submitBtnDisabled;
          this.SubmitBtnTooltip = "";
        }
      });
      console.log(this.quesCtrl);
      console.log("no of tabs should be ", this.quesTabs.length);
      this.assetsPath = this.appModel.assetsfolderpath;
      this.containgFolderPath = this.appModel.content.id;
      this.themeType = controlAssets.theme_type
      console.log("this.themeType", this.themeType, controlAssets)
    })

    this.blinkerSubscription = this.appModel.getblinkingNextBtn().subscribe(resetBlink => {
      if (resetBlink) {
        this.blinkFlag = false;
        clearInterval(this.timeInterval);
        this.timeInterval = undefined;
        if (this.quesCtrl != undefined) {
          this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
        }
      }
    });

    this.firstQusubscription = this.appModel.getIsFirstQuestion().subscribe(flag => {
      this.isFirstQuestion = flag;
    })

    // this.CommonSubscription = this.appModel.getCommonControlAssets().subscribe(commonData =>{
    //   console.log("commonData",commonData)
    //   if(commonData){
    //     //this.quesTabs = commonData.quesTabs;
    //     this.quesTabs = commonData.quesTabs.slice(0, this.noOfQues);
    //     this.themePath  = this.appModel.getPath("tabs")
    //     this.quesCtrl = commonData;
    //     this.buttonPath = this.appModel.getPath("buttons")
    //   }
    //   console.log("this.themePath",this.themePath, "buttonPath",this.buttonPath)
    // })

    this.subcriptionUttarDikhayein = this.appModel.getPostVOActs().subscribe(flag => {
      this.disableUttarDikhayeinBtn = flag;
    })

    this.appModel.lastQues.subscribe(() => {
      if (!this.timeInterval) {
        this.setBlinkOnLastQuestion();
      }
    })

    this.appModel.enableFlagSubmit.subscribe((flag) => {
      this.enableSubmitBtn = flag

    })

    this.appModel.enableFlagNav.subscribe((flag) => {
      console.log("nav wala flaggg")
      this.enableNavBtns = flag
    })


    this.appModel.enableFlagReplay.subscribe((flag) => {
      this.enableReplayBtn = flag
    })

    this.appModel.isVideoStraming.subscribe((flag) => {
      this.isVideoPlaying = flag;
      if (flag == false) {
        this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_original;
      }
    })
    this.appModel.controllerHandler.subscribe((controllerObj) => {
      this.controlHandle(controllerObj);
    });
  }


  hoverUttarDikhayeinEVA() {
    if (this.EnableShowAnswer) {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_hover;
    } else {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    }
  }

  houtUttarDikhayeinEVA() {
    if (this.EnableShowAnswer) {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
    } else {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    }

  }

  hoveronSubmitBtn() {
    if (this.EnableSubmitAnswer) {
      this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_hover;
    } else {
      this.quesCtrl.submit_btn = this.quesCtrl.submitBtnDisabled;
    }
  }

  hleaveSubmitBtn() {
    if (this.EnableSubmitAnswer) {
      this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_original;
    } else {
      this.quesCtrl.submit_btn = this.quesCtrl.submitBtnDisabled;
    }
  }


  selectQuestion(index) {
    if (this.appModel.titleFlag) {
      this.appModel.selectQues(index + 1);
    } else {
      this.appModel.selectQues(index);
    }
    clearInterval(this.timeInterval);
    this.timeInterval = undefined;
    this.blinkFlag = false;
    this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[index].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_hover.url;
    }else{
        this.quesBlockChild.nativeElement.children[index].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_hover.url;
    }*/
    /*	for(let i =0;i<this.quesTabs.length;i++){
            this.quesBlockChild.nativeElement.children[index].children[0].style.opacity = "1";
            this.quesBlockChild.nativeElement.children[index].children[1].style.opacity = "1";
            this.quesBlockChild.nativeElement.children[index].children[2].style.opacity = "1";
        }*/
  }


  confirmAction(action) {
    if (this.EVA) {
      this.appModel.confirmPopup(action);
    }
    if (!this.EVA) {
      this.appModel.confirmPopup(action);
    }
  }

  hoverUttarDikhayein() {
    this.ansBtnElem.nativeElement.style.cursor = "pointer";
    this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_hover;
  }

  houtUttarDikhayein() {
    this.ansBtnElem.nativeElement.style.cursor = "";
    this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
  }

  hoverQuesIdx(idx) {
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_hover.url;
    }else{
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_hover.url;
    }*/
  }

  houtQuesIdx(idx) {
    /*if(this.controlAssets.ques_idx_hover && this.controlAssets.ques_idx_hover.location=="content"){
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.containgFolderPath + "/" + this.controlAssets.ques_idx_original.url;
    }else{
        this.quesBlockChild.nativeElement.children[idx].children[0].src = this.assetsPath + "/" + this.controlAssets.ques_idx_original.url;
    }*/
  }


  previous() {
    clearInterval(this.timeInterval);
    this.timeInterval = undefined;
    this.blinkFlag = false;

    this.EnableShowAnswer = false;
    if (this.EVA) {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
    } else {
      this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
    }
    this.appModel.previousSection();

    this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
    this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_original;
  }


  hoverPreBtn() {
    if (!this.EVA) {
      this.prevBtnEle.nativeElement.style.cursor = "pointer";
    }
    this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_hover;
  }
  next() {
    
    if (this.appModel && !this.appModel.isLastSection && !this.disableAageBadhey) {
      console.log("clicked---------------------------------------------------------------------------------->>>>>>>>>>>>>")
      clearInterval(this.timeInterval);
      this.timeInterval = undefined;
      this.blinkFlag = false;
      this.EnableShowAnswer = false;
      if (this.EVA) {
        this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
      } else {
        this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_original;
      }
      //this.quesCtrl.uttar_dikhayein = this.quesCtrl.uttar_dikhayein_disable;
      this.UttarDikhayeinTooltip = "";
      this.appModel.nextSection();
      this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
      setTimeout(() => {
      this.disableAageBadhey =false
    }, 2500);
    }
  }


  hleavePreBtn() {
    if (this.EVA && this.isFirstQuestion) {
      this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_disabled;
    } else {
      if (!this.EVA) {
        this.prevBtnEle.nativeElement.style.cursor = "";
      }
      this.quesCtrl.peechey_jayein = this.quesCtrl.peechey_jayein_original;
    }
  }


  hoverNextBtn() {
    if (!this.EVA) {
      this.nextBtnEle.nativeElement.style.cursor = "pointer";
    }
    if (!this.blinkFlag) {
      if (!this.blink) {
        this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_hover;
      }
    }
  }


  hleaveNextBtn() {
    if (!this.EVA) {
      this.nextBtnEle.nativeElement.style.cursor = "";
    }
    if (!this.blinkFlag) {
      if (!this.blink) {
        if (this.EVA && this.isLastQues && !this.quesCtrl.blinkingStatus) {
          this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_disabled;
        } else {
          this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
        }
      }
    }
  }

  hoverSubmitBtn() {
    this.submitBtnElem.nativeElement.style.cursor = "pointer";
    this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_hover;
  }

  houtSubmitBtn() {
    this.submitBtnElem.nativeElement.style.cursor = "";
    this.quesCtrl.submit_btn = this.quesCtrl.submit_btn_original;
  }


  hoverReplayBtn() {
    this.replayBtnElem.nativeElement.style.cursor = "pointer";
    this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_hover;
  }

  houtReplayBtn() {
    if (!this.isVideoPlaying) {
      this.replayBtnElem.nativeElement.style.cursor = "";
      this.quesCtrl.replay_btn = this.quesCtrl.replay_btn_original;
    }
  }

  setBlinkOnLastQuestion() {
    if (this.EVA) {
      // if(this.EnableShowAnswer === true){
      this.quesCtrl.aagey_badhein = this.quesCtrl.aagey_badhein_original;
      this.nextBtn.nativeElement.classList.remove("disableBtn");
      this.quesCtrl.blinkingStatus = true;
      // }
    } else {
      this.blinkFlag = true;
      let flag = true;
      this.timeInterval = setInterval(() => {
        if (flag) {
          if (this.appModel.theme_name) {
            this.quesCtrl.aagey_badhein = this.appModel.isLastSectionInCollection ? this.quesCtrl.blink_btn3 : this.quesCtrl.blink_btn1;
          } else {
            this.quesCtrl.aagey_badhein = this.quesCtrl.blink_btn1;
          }
          flag = false;
        } else {
          if (this.appModel.theme_name) {
            this.quesCtrl.aagey_badhein = this.appModel.isLastSectionInCollection ? this.quesCtrl.blink_btn4 : this.quesCtrl.blink_btn2;
          } else {
            this.quesCtrl.aagey_badhein = this.quesCtrl.blink_btn2;
          }
          flag = true;
        }
      }, 300)
    }
  }

  controlHandle(controlObj) {
    console.log("object of controller");
    console.log(controlObj);
    this.disableNext = controlObj.isNext;
    this.disablePrev = controlObj.isPrev;
    this.hideShowAnswer = controlObj.isShowAns;
    this.disableTabs = controlObj.isTab;
    this.disableSubmit = controlObj.isSubmitRequired;
    this.disableReplay = controlObj.isReplayRequired;
    this.tempReplayBtn = controlObj;
    if (controlObj.ReplaybtnFromContent) {
      this.ReplaybtnFromContent = true;
      // this.quesCtrl.replay_btn=controlObj.replay_btn;
      // this.quesCtrl.replay_btn_hover=controlObj.replay_btn_hover;
      // this.quesCtrl.replay_btn_original=controlObj.replay_btn_original;
    }

  }
  ngOnDestroy() {
    this.blinkerSubscription.unsubscribe();
    this.subscription.unsubscribe();
  }

  confirmActionEVA(type) {
    if (type == "submitAnswer") {
      this.Sharedservice.setShowHideConfirmation(true)
    }
  }
}
