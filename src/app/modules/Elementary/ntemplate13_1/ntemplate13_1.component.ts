import { Component, OnInit, ViewChild, AfterViewChecked, OnDestroy } from '@angular/core';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { SharedserviceService } from '../../../common/services/sharedservice.service';
import { Subscription } from 'rxjs'
import { PlayerConstants } from '../../../common/playerconstants';
import { ThemeConstants } from '../../../common/themeconstants';
import { timer } from 'rxjs/observable/timer';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-ntemplate13_1',
  templateUrl: './ntemplate13_1.component.html',
  styleUrls: ['./ntemplate13_1.component.scss']
})
export class NTemplate13V1Component implements OnInit, AfterViewChecked, OnDestroy {
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
	@ViewChild('wrongOptAudio') wrongOptAudio: any;
	@ViewChild('optionAudio') optionAudio: any;
	@ViewChild('correctAns') correctAns: any;
	@ViewChild('burst') burst: any;
	@ViewChild('optionBlock') optionBlock: any;
	@ViewChild('titleNavBtn') titleNavBtn: any;
	@ViewChild('maincontent') maincontent: any;
	@ViewChild('helpBtn') helpBtn: any;
	@ViewChild('titleAudio') titleAudio: any;
	@ViewChild('titleHelpAudio') titleHelpAudio: any;
	@ViewChild('feedbackModalRef') feedbackModalRef: any;
	@ViewChild('clapSound') clapSound: any;
	@ViewChild('buzzerSound') buzzerSound: any;
	@ViewChild('wrongFeedback') wrongFeedback: any;
	@ViewChild('navBlock') navBlock: any;
	@ViewChild('autoPlayOnOffContainer') autoPlayOnOffContainer: any;
	@ViewChild('confirmModalRef') confirmModalRef: any;
	@ViewChild('confirmReplayRef') confirmReplayRef: any;
	@ViewChild('feedbackVoRef') feedbackVoRef: any;
	@ViewChild('speakerd') speakerd: any;

	disableSection: boolean = false;
	quesInfo: any = "";
	myoption: any = [];
	question: any = "";
	feedback: any = "";
	showIntroScreen: boolean = true;
	commonAssets: any = "";
	idArray: any = [];
	showAnsAuto:boolean = false;
	isFirstQues: boolean;
	isLastQues: boolean = false;
	isLastQuesAct: boolean;
	quesObj: any;
	isPlayVideo: boolean;
	noOfImgs: number;
	noOfImgsLoaded: number = 0;
	loaderTimer: any;
	containgFolderPath: string = "";
	assetsPath: string = "";
	loadFlag: boolean = false;
	disableHelpBtn: boolean = false;
	confirmPopupAssets: any;
	feedbackObj: any;
	tempSubscription: Subscription;
	wrongImgOption: any;
	feedbackPopup: any;
	rightPopup: any;
	attemptType: string = "";
	popUpClosed: boolean = false;
	ifWrongAns: boolean = false;
	ifRightAns: boolean = false;
	rightAnsSoundUrl: string = "";
	fixedOptions: any = [];
	themePath: any;
	fetchedcontent: any;
	functionalityType: any;
	showAnsTimeout: any;
	closeDelayTime: any;
	styleHeaderPopup: any;
	styleBodyPopup: any;
	rightanspopUpheader_img: boolean = false;
	wronganspopUpheader_img: boolean = false;
	showanspopUpheader_img: boolean = false;
	rightAnspopupAssets: any;
	disableSpeaker: boolean = true;
	showAnsModalPopup: boolean = false
	controlHandler = {
		isSubmitRequired: false,
		isReplayRequired: false
	};
	wrongOptAudioPlaying: boolean = false;
	optionDisable: boolean = true;
	AnswerpopupTxt: boolean = false;
	popupHeader: any;
	lastOpt: any;
	confirmPopupSubscription: any;
    timerSubscription: Subscription;
    isLastQuestion: boolean;
    actComplete: boolean = false;
	showWaveOnPopup: boolean = false;
	isCursorPointer: boolean = true;
	instructionOpacity: boolean = false;
	optionsOpacity: boolean = false;
	isChecked:boolean = false;
	

	/**** life cycle hooks starts ****/
	ngOnInit() {
		this.appModel.handlePostVOActivity(true);
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		this.appModel.functionone(this.templatevolume, this);//start end
		this.containgFolderPath = this.getBasePath();
		if (this.appModel.isNewCollection) {
			this.appModel.event = { 'action': 'segmentBegins' };
		}
		let fetchedData: any = this.appModel.content.contentData.data;
		this.fetchedcontent = JSON.parse(JSON.stringify(fetchedData));;
		this.functionalityType = this.appModel.content.contentLogic.functionalityType;
		this.themePath = ThemeConstants.THEME_PATH + this.fetchedcontent.productType + '/' + this.fetchedcontent.theme_name;
		this.Sharedservice.imagePath(this.fetchedcontent, this.containgFolderPath, this.themePath, this.functionalityType);
		this.checkquesTab();
		this.appModel.globalJsonData.subscribe(data => {
			this.showAnsTimeout = data.showAnsTimeout;
			if (this.feedback.closeDelayTime) {
				this.closeDelayTime = this.feedback.closeDelayTime
			} else {
				this.closeDelayTime = this.showAnsTimeout;
			}
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

		this.confirmPopupSubscription = this.appModel.getConfirmationPopup().subscribe((val) => {
			if(!this.isChecked) {
				for (var i = 0; i < this.myoption.length; i++) {
					this.optionBlock.nativeElement.children[i].children[2].pause();
					this.optionBlock.nativeElement.children[i].children[2].currentTime = 0;
					this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
	
					this.optionBlock.nativeElement.children[i].className = "options";
					this.optionBlock.nativeElement.children[i].children[0].style.cursor = "pointer";
				}
			}

			if (val == "uttarDikhayein") {

				if (this.instruction && !this.instruction.nativeElement.paused) {
					this.instruction.nativeElement.currentTime = 0;
					this.instruction.nativeElement.pause();
				}

				if (this.confirmModalRef && this.confirmModalRef.nativeElement) {
					this.confirmModalRef.nativeElement.classList = "displayPopup modal";
					this.resetAllWaves();
					this.checkForAutoClose();
					this.appModel.notifyUserAction();
				}
			} else if (val == "replayVideo") {
				if (this.confirmReplayRef && this.confirmReplayRef.nativeElement) {
					this.confirmReplayRef.nativeElement.classList = "displayPopup modal";
					this.appModel.notifyUserAction();
				}
			}
		})

		this.styleHeaderPopup = this.feedbackObj.style_header;
		this.styleBodyPopup = this.feedbackObj.style_body;
		this.rightanspopUpheader_img = false;
		this.wronganspopUpheader_img = false;
		this.showanspopUpheader_img = true;
		this.tempSubscription = this.appModel.getNotification().subscribe(mode => {
			this.isChecked = true;
			if (mode == "manual") {
				//show modal for manual
				this.appModel.notifyUserAction();
				if (this.correctAns && this.correctAns.nativeElement) {
					this.disableSection = true;
					this.correctAns.nativeElement.classList = "displayPopup modal";
				}
				console.log("mode manuall", mode)

			} else if (mode == "auto") {
				if (this.feedbackObj.showAnswerpopupTxt.required) {
					this.AnswerpopupTxt = true;
					this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;				 
				} else {
					this.AnswerpopupTxt = false;			 
				}
				this.showAnsAuto = true;
				this.confirmModalRef.nativeElement.classList = "modal";
				this.showAnsModal(this.fixedOptions[this.feedback.correct_ans_index]);
				this.instructionOpacity = true;
				this.optionsOpacity = true;
				this.disableSection = true;
			}
		})

		this.appModel.postWrongAttempt.subscribe(() => {
			this.postWrongAttemplt();
		});
		this.appModel.resetBlinkingTimer();
		this.appModel.handleController(this.controlHandler);
	}

	ngAfterViewChecked() {
		if (this.titleAudio && this.titleAudio.nativeElement) {
			this.titleAudio.nativeElement.onended = () => {
				this.titleNavBtn.nativeElement.className = "d-flex justify-content-end showit fadeInAnimation";
			}
		}
		this.templatevolume(this.appModel.volumeValue, this);
	}

	ngOnDestroy() {
		this.narrator.nativeElement.pause();
		this.narrator.nativeElement.currentTime = 0;
		if (this.confirmPopupSubscription != undefined) {
            this.confirmPopupSubscription.unsubscribe();
        }
        if (this.tempSubscription != undefined) {
            this.tempSubscription.unsubscribe();
        }
	}
	/**** life cycle hooks ends here ****/

	/**** mouse hover and hover out functions starts ****/
	hoverDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_hover;
	}

	houtDecline() {
		this.confirmPopupAssets.decline_btn = this.confirmPopupAssets.decline_btn_original;
	}

	hoverOk() {
		this.commonAssets.ok_btn = this.commonAssets.ok_btn_hover;
	}

	houtOk() {
		this.commonAssets.ok_btn = this.commonAssets.ok_btn_original;
	}


	showhoverConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_hover;
	}

	showhoutConfirm() {
		this.confirmPopupAssets.confirm_btn = this.confirmPopupAssets.confirm_btn_original;
	}
	hoverCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_hover;
	}
	houtCloseConfirm() {
		this.confirmPopupAssets.close_btn = this.confirmPopupAssets.close_btn_original;
	}

	onHoverOption(opt, index) {
		this.isCursorPointer = true;
		this.disableSection = false;
		//pauseinstruction VO
		console.log("this.lastOpt:", this.lastOpt, "index:", index)
		if (this.lastOpt != index) {

			this.appModel.notifyUserAction();
			if (!this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}

			for (let i in this.myoption) {
				if (!this.optionBlock.nativeElement.children[i].children[2].paused) {
					return false;
				}

			}

			if (this.titleHelpAudio && this.titleHelpAudio.nativeElement) {
				this.titleHelpAudio.nativeElement.pause();
				this.titleHelpAudio.nativeElement.currentTime = 0;
			}
			if (opt.sound) {
				this.optionBlock.nativeElement.children[index].children[2].play();
				opt['isSpeakerPlayed'] = true;
				this.lastOpt = index;
			}
			for (let option = 0; option < this.myoption.length; option++) {
				if (option == index) {
					this.optionBlock.nativeElement.children[option].className = "options";
					this.optionBlock.nativeElement.children[option].children[0].style.cursor = "pointer";
				} else {
					this.optionBlock.nativeElement.children[option].className = " disable_div options classOpacity";
				}
			}
			this.optionBlock.nativeElement.children[index].children[2].onended = () => {
				opt['isSpeakerPlayed'] = false;
				this.optionBlock.nativeElement.children[index].children[1].className = "speaker";
				for (let option = 0; option < this.myoption.length; option++) {
					this.optionBlock.nativeElement.children[option].className = "options";
				}
			}
		}
		else {
			console.log("same option");
		}
	}

	/**** option vo on hover out ****/
	onHoverOptionOut(opt) {
		opt.imgsrc = opt.imgsrc_original;
		this.lastOpt = undefined;
	}

	/**** instruction vo on hover ****/
	playHoverInstruction() {
		for (var i = 0; i < this.myoption.length; i++) {
			this.optionBlock.nativeElement.children[i].children[2].pause();
			this.optionBlock.nativeElement.children[i].children[2].currentTime = 0;
			this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
		}
		for (let option = 0; option < this.myoption.length; option++) {

			this.optionBlock.nativeElement.children[option].className = "options";

		}
		this.disableSection = true;
		this.appModel.notifyUserAction();
		if (!this.narrator.nativeElement.paused) {
			console.log("narrator/instruction voice still playing");
		} else {
			console.log("play on Instruction");
			if (this.instruction.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.play();
				this.isCursorPointer = false;
			}
			if (this.optionAudio && !this.optionAudio.nativeElement.paused) {
				this.instruction.nativeElement.currentTime = 0;
				this.instruction.nativeElement.pause();
			}
			this.resetAllWaves();
		}
		this.instruction.nativeElement.onended = () => {
			this.disableSection = false;
			this.isCursorPointer = true;
		}
	}
	/**** mouse hover and hover out functions ends ****/

	/**** function call after wrong attempt ****/
	postWrongAttemplt() {
		//wrong-right ans
		for(let option of this.optionBlock.nativeElement.children) {
			option.className = "options animation-shake disable_div";
		}
		this.doRandomize(this.myoption);
		this.optionDisable = true;

		setTimeout(() => {
			for(let option of this.optionBlock.nativeElement.children) {
				option.className = "options disable_div";
			}
		}, 1000);
		setTimeout(() => {
			this.optionBlock.nativeElement.className = "";
			for(let option of this.optionBlock.nativeElement.children) {
				option.className = "options";
			}
		}, 1300);
		this.appModel.startPreviousTimer();
		this.appModel.notifyUserAction();
		//shake options
	}

	/**** remove waves for all options ****/
	resetAllWaves() {
		this.myoption.forEach(option => {
			if(option.isSpeakerPlayed) {
				option.isSpeakerPlayed = false;
			}
		})
	}

	enableAllOptions() {
		for(let option of this.optionBlock.nativeElement.children) {
			option.classList.remove("classOpacity");
		}
	}

	/**** function call on open and close of popups ****/
	sendFeedback(id: string, flag: string) {
		if (this.timerSubscription != undefined) {
            this.timerSubscription.unsubscribe();
        }
		this.resetAllWaves();
		this.showWaveOnPopup = false;
		console.log(id);
		console.log(flag);
		this.confirmModalRef.nativeElement.classList = "modal";
		this.correctAns.nativeElement.classList = "modal";
		this.wrongOptAudio.nativeElement.pause();
		this.feedbackVoRef.nativeElement.pause();
		if (!this.instruction.nativeElement.paused) {
			this.instruction.nativeElement.currentTime = 0;
			this.instruction.nativeElement.pause();
		}
		if (flag == "yes") {
			this.showAnsModalPopup = true;

			if (this.feedbackObj.showAnswerpopupTxt.required) {
				this.AnswerpopupTxt = true;
				this.popupHeader = this.feedbackObj.showAnswerpopupTxt.url;				 
			} else {
				this.AnswerpopupTxt = false;			 
			}
			//show answer
			this.showAnsModal(this.fixedOptions[this.feedback.correct_ans_index])

			if (this.optionsBlock) {
				this.optionsBlock.nativeElement.classList = "row mx-0 disable_div";
			}
			this.appModel.invokeTempSubject('showModal', 'manual');
			this.instructionOpacity = true;
			this.optionsOpacity = true;
			this.disableSection = true;
		} else {
			this.isCursorPointer = true;
			this.disableSpeaker = true;
			if(this.showAnsModalPopup){
				this.removeEvents();
			this.blinkOnLastQues();
			}
			if(this.showAnsAuto){
				this.removeEvents();
			this.blinkOnLastQues();
			}
			console.log("closing modal")
			this.popUpClosed = true;
			this.wrongOptAudioPlaying = false;
			//close modal
			if (this.instruction.nativeElement) {
				this.clapSound.nativeElement.pause()
			}
			if (this.wrongFeedback.nativeElement) {
				this.wrongFeedback.nativeElement.pause()
			}
			console.log("this.ifWrongAns", this.ifWrongAns)
			if (this.ifWrongAns) {
				
				this.removeEvents();
				this.appModel.wrongAttemptAnimation();
				this.idArray = [];
				for (let i of this.myoption) {
					this.idArray.push(i.id);
				}

				this.doRandomize(this.myoption);
				setTimeout(() => {
					this.optionBlock.nativeElement.className = "";
				}, 200)
				for (let i in this.myoption) {
					this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
				}
				this.ifWrongAns = false;
			}

			if (this.ifRightAns) {
				
				this.removeEvents();
				this.ifRightAns = false;
				this.instructionOpacity = true;
				this.optionsOpacity = true;
				this.disableSection = true;
				this.maincontent.nativeElement.children[0].classList.add("classOpacity");
				this.maincontent.nativeElement.children[0].classList.add("disable_div");
				this.blinkOnLastQues();
			}
			if(!this.isChecked) {
				this.disableSection = false;
			}
			this.appModel.notifyUserAction();
		}
	}

	checkquesTab() {
		if (this.fetchedcontent.commonassets.ques_control != undefined) {
			this.appModel.setQuesControlAssets(this.fetchedcontent.commonassets.ques_control);
		} else {
			this.appModel.getJson();
		}
	}

	/**** function to control volume of audio and video files ****/
	templatevolume(vol, obj) {
		if (obj.wrongOptAudio && obj.wrongOptAudio.nativeElement) {
			obj.wrongOptAudio.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.feedbackVoRef && obj.feedbackVoRef.nativeElement) {
			obj.feedbackVoRef.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.narrator && obj.narrator.nativeElement) {
			obj.narrator.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.instruction && obj.instruction.nativeElement) {
			obj.instruction.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}
		if (obj.wrongFeedback && obj.wrongFeedback.nativeElement) {
			obj.wrongFeedback.nativeElement.volume = obj.appModel.isMute ? 0 : vol;
		}

		if (obj.optionBlock && obj.optionBlock.nativeElement) {
			for (let i in obj.myoption) {
				obj.optionBlock.nativeElement.children[i].children[2].volume = obj.appModel.isMute ? 0 : vol;
			}
		}
	}


	/**** set data after initialization ****/
	setData() {
		let navTimer = setInterval(() => {
			if (this.navBlock && this.navBlock.nativeElement) {
				clearInterval(navTimer);
				setTimeout(() => {
					if (this.navBlock && this.navBlock.nativeElement) {
						this.navBlock.nativeElement.className = "d-flex flex-row align-items-center justify-content-around"
					}
				}, 500)
			}
		}, 100)
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			console.log(this.fetchedcontent);
			if (this.fetchedcontent && this.fetchedcontent.titleScreen) {
				this.showIntroScreen = true;
			} else {
				this.showIntroScreen = false;
			}

			this.myoption = this.fetchedcontent.optionObj;
			this.fixedOptions = JSON.parse(JSON.stringify(this.fetchedcontent.optionObj))
			console.log(this.myoption);
			this.feedback = this.fetchedcontent.feedback;
			this.commonAssets = this.fetchedcontent.commonassets;
			// this.narratorAudio = this.fetchedcontent.commonassets.narrator;
			this.question = this.fetchedcontent.ques;
			this.feedback = this.fetchedcontent.feedback;
			this.quesInfo = this.fetchedcontent.commonassets;
			this.isFirstQues = this.quesInfo.isFirstQues;
			this.isLastQues = this.appModel.isLastSection;
			this.isLastQuesAct = this.appModel.isLastSectionInCollection;
			this.isLastQuestion = this.commonAssets.isLastQues;
			this.noOfImgs = this.quesInfo.imgCount;
			this.quesObj = this.fetchedcontent.quesObj;
			this.confirmPopupAssets = this.fetchedcontent.feedback.confirm_popup;
			this.feedbackObj = this.fetchedcontent.feedback;
			this.rightAnspopupAssets = this.feedbackObj.right_ans_popup;
			this.rightAnsSoundUrl = this.myoption[this.feedback.correct_ans_index]
			if (this.quesObj.quesVideo && this.quesObj.quesVideo.autoPlay && !this.appModel.isVideoPlayed) {
				this.isPlayVideo = true;
			} else {
				this.isPlayVideo = false;
			}
			this.controlHandler = {
				isSubmitRequired: this.quesObj.submitRequired,
				isReplayRequired: this.quesObj.replayRequired
			}
		} else {
			this.myoption = [];
			this.question = "";
			this.feedback = "";
			this.quesInfo = "";
		}
	}

	/**** auto close functionality for confirmation popup on last question starts ****/
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

	/**** auto close functionality for confirmation popup on last question ends ****/

	/**** check answer on click of option ****/
	checkAnswer(opt) {
		for (var i = 0; i < this.myoption.length; i++) {
			this.optionBlock.nativeElement.children[i].children[2].pause();
			this.optionBlock.nativeElement.children[i].children[2].currentTime = 0;
			this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
		}
		this.resetAllWaves();
		this.enableAllOptions();
		this.speakerd.nativeElement.classList.remove("dispFlex");
		this.disableHelpBtn = true;
		opt.imgsrc = opt.imgsrc_original;
		this.popUpClosed = false;
		// logic to check what user has done is correct or wrong
		if (opt.custom_id == this.feedback.correct_ans_index) {
			this.wrongImgOption = opt
			if (this.feedbackObj.rightAnswerpopupTxt.required) {
				this.AnswerpopupTxt = true;
				this.popupHeader = this.feedbackObj.rightAnswerpopupTxt.url;
				 
			} else {
				this.AnswerpopupTxt = false;
			}
			this.rightanspopUpheader_img = true;
			this.wronganspopUpheader_img = false;
			this.showanspopUpheader_img = false;
			this.isChecked = true;
			this.styleHeaderPopup = this.feedbackObj.style_header;
			this.styleBodyPopup = this.feedbackObj.style_body;
			this.attemptType = "manual";
			this.appModel.stopAllTimer();
			//Analytics
			//fireworks 
			this.ifRightAns = true;
			this.showAnsModalPopup = false;
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
			this.disableSection = true;

			this.feedbackVoRef.nativeElement.src = opt.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);

			setTimeout(() => {
				this.feedbackVoRef.nativeElement.play();
				this.disableSpeaker = true;
			}, 50)

			this.feedbackVoRef.nativeElement.onended = () => {
				this.disableSpeaker = false;

			}

		} else {
			if (this.feedbackObj.wrongAnswerpopupTxt.required) {
				this.AnswerpopupTxt = true;
				this.popupHeader = this.feedbackObj.wrongAnswerpopupTxt.url;
				 
			} else {
				this.AnswerpopupTxt = false;
				 
			}
			this.ifWrongAns = true;
			this.showAnsModalPopup = false;
			this.styleHeaderPopup = this.feedbackObj.wrong_style_header;
			this.styleBodyPopup = this.feedbackObj.wrong_style_body;
			this.wrongImgOption = opt  //setting wrong image options
			this.rightanspopUpheader_img = false;
			this.wronganspopUpheader_img = true;
			this.showanspopUpheader_img = false;
			this.optionBlock.nativeElement.className = "disable_div";
			let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
			correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";

			this.appModel.stopAllTimer();
			//play wrong feed back audio
			this.feedbackVoRef.nativeElement.src = opt.imgwrongfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);
			setTimeout(() => {
				this.feedbackVoRef.nativeElement.play();
				this.disableSpeaker = true;
			}, 50)
			this.feedbackVoRef.nativeElement.onended = () => {
				this.disableSpeaker = false;
			}
		}
	}

	removeEvents() {
		this.correctAns.nativeElement.className = "modelpopup d-flex align-items-center justify-content-center hideit";
		this.burst.nativeElement.className = "d-flex align-items-center justify-content-center hideit"
	}

	/**** random function to reshuffle options ****/
	doRandomize(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		// While there remain elements to shuffle...
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		var flag = this.arraysIdentical(array, this.idArray);
		console.log(flag);
		if (flag) {
			this.doRandomize(array);
		}
		else {

		}
	}

	arraysIdentical(a, b) {
		console.log("checking:", a, b);
		var i = a.length;
		var bool = false;
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

	checkImgLoaded() {
		if (!this.loadFlag) {
			this.noOfImgsLoaded++;
			console.log("this.noOfImgsLoaded", this.noOfImgsLoaded, this.noOfImgs)
			if (this.noOfImgsLoaded >= this.noOfImgs) {
				this.appModel.setLoader(false);
				this.loadFlag = true;
				this.checkforQVO();
				clearTimeout(this.loaderTimer);
			}
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	/**** check for question VO on load ****/
	checkforQVO() {
		if (this.quesObj && this.quesObj.quesInstruction && this.quesObj.quesInstruction.url && this.quesObj.quesInstruction.autoPlay) {
			this.narrator.nativeElement.src = this.quesObj.quesInstruction.url + "?someRandomSeed=" + Math.random().toString(36);
			this.appModel.handlePostVOActivity(true);
			this.appModel.enableReplayBtn(false);
			this.narrator.nativeElement.play();
			this.disableSection = true;

			this.narrator.nativeElement.onended = () => {
				this.disableSection = false;
				this.appModel.handlePostVOActivity(false);
				if (this.quesObj.replayRequired) {
					this.appModel.enableReplayBtn(true);
				}
				//enable ansBlock
				this.optionBlock.nativeElement.className = "";
			}
		} else {
			this.appModel.handlePostVOActivity(false);
			this.appModel.enableReplayBtn(true);
		}
	}

	/**** hover on option image in popup ****/
	onWrongImgHoverOption(option) {
		console.log("Start - " + this.wrongOptAudioPlaying);
		if (!this.wrongOptAudioPlaying) {
			//stop clapping
			if (this.instruction.nativeElement) {
				this.clapSound.nativeElement.pause()
			}

			//stop other sounds
			if (this.wrongFeedback.nativeElement) {
				this.wrongFeedback.nativeElement.pause()
				this.wrongFeedback.nativeElement.currentTime = 0
			}
			if (this.feedbackVoRef.nativeElement) {
				this.feedbackVoRef.nativeElement.pause();
				this.feedbackVoRef.nativeElement.currentTime = 0
			}
			this.playAnySound(option.sound.url);
			this.showWaveOnPopup = true;
			this.wrongOptAudioPlaying = true;
			console.log("Start 1 - " + this.wrongOptAudioPlaying);
			this.wrongOptAudio.nativeElement.onended = () => {
				this.wrongOptAudioPlaying = false;
				this.speakerd.nativeElement.classList.remove("dispFlex");
				this.showWaveOnPopup = false;
				console.log("Start 2 - " + this.wrongOptAudioPlaying);
			}
		}
	}

	/**** function to play VO on option hover in popup ****/
	playAnySound(sound) {
		this.containgFolderPath = this.getBasePath();
		this.wrongOptAudio.nativeElement.pause();
		this.wrongOptAudio.nativeElement.src = sound;
		this.wrongOptAudio.nativeElement.load();
		this.wrongOptAudio.nativeElement.play();

	}

	/**** function called on blink of last question ****/
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

	/**** function called on show answer popup ****/
	showAnsModal(opt) {
		for (var i = 0; i < this.myoption.length; i++) {
			this.optionBlock.nativeElement.children[i].children[2].pause();
			this.optionBlock.nativeElement.children[i].children[2].currentTime = 0;
			this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
		}
		this.styleHeaderPopup = this.feedbackObj.style_header;
		this.styleBodyPopup = this.feedbackObj.style_body;
		this.speakerd.nativeElement.classList.remove("dispFlex");
		this.appModel.stopAllTimer();
		this.attemptType = "hideAnimation"
		this.ifWrongAns = false;
		this.ifRightAns = false;
		this.wrongImgOption = this.rightAnsSoundUrl
		this.feedbackPopup = this.rightPopup;
		let correctAns: HTMLElement = this.correctAns.nativeElement as HTMLElement
		correctAns.className = "modal d-flex align-items-center justify-content-center showit correctAns dispFlex";
		//disable option and question on right attempt
		this.maincontent.nativeElement.className = "d-flex align-items-center justify-content-center disable_div";
		if (this.optionBlock && this.optionBlock.nativeElement) {
			this.optionBlock.nativeElement.className = "disable-ansBlock";
		}
		this.disableSection = true;
		this.instructionOpacity = true;
		this.optionsOpacity = true;
		this.maincontent.nativeElement.children[0].classList.add("classOpacity");
		this.maincontent.nativeElement.children[0].classList.add("disable_div");
		this.feedbackVoRef.nativeElement.src = this.feedback.right_ans_popup.imgrightfeedback_audio.url + "?someRandomSeed=" + Math.random().toString(36);

		setTimeout(() => {
			this.disableSpeaker = true;
			this.feedbackVoRef.nativeElement.play();
		}, 50)
		this.appModel.resetBlinkingTimer();
		this.feedbackVoRef.nativeElement.onended = () => {

			this.disableSpeaker = false;

		}
	}

	/**** function call on click of ok button of popup ****/
	closePopup() {
		this.disableSpeaker = true;
		this.resetAllWaves();
		this.showWaveOnPopup = false;
		if (this.showAnsModalPopup) {
			this.feedbackVoRef.nativeElement.pause();
			this.wrongOptAudio.nativeElement.pause();
			this.wrongOptAudio.nativeElement.currentTime = 0
			this.removeEvents();
			this.blinkOnLastQues();
			this.wrongOptAudioPlaying = false;
		}else if(this.showAnsAuto){
			this.feedbackVoRef.nativeElement.pause();
			this.wrongOptAudio.nativeElement.pause();
			this.wrongOptAudio.nativeElement.currentTime = 0
			this.removeEvents();
			this.blinkOnLastQues();
			this.wrongOptAudioPlaying = false;
		} else if (this.ifRightAns) {
			this.feedbackVoRef.nativeElement.pause();
			if (!this.popUpClosed) {
				this.removeEvents();
				this.ifRightAns = false;
				this.disableSection = true;
				this.instructionOpacity = true;
				this.optionsOpacity = true;
				this.maincontent.nativeElement.children[0].classList.add("classOpacity");
				this.maincontent.nativeElement.children[0].classList.add("disable_div");
				this.blinkOnLastQues();
				this.wrongOptAudio.nativeElement.pause();
				this.wrongOptAudio.nativeElement.currentTime = 0;

			}
			this.wrongOptAudioPlaying = false;
			this.disableSpeaker = true;
		} else if (this.ifWrongAns) {
			this.feedbackVoRef.nativeElement.pause();
			if (!this.popUpClosed) {
				this.removeEvents();
				this.appModel.wrongAttemptAnimation();
				this.idArray = [];
				for (let i of this.myoption) {
					this.idArray.push(i.id);
				}

				for (let i in this.myoption) {
					this.optionBlock.nativeElement.children[i].children[1].className = "speaker";
				}
				this.ifWrongAns = false;
			}
			this.wrongOptAudio.nativeElement.pause();
			this.wrongOptAudio.nativeElement.currentTime = 0;
			this.wrongOptAudioPlaying = false;
			this.disableSpeaker = true;
		}
	}
}
