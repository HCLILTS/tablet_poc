import { Component, OnInit, ViewEncapsulation, ViewChild, HostListener, AfterViewChecked } from '@angular/core';
// import { CommonModule } from '@angular/common';
import { PlayerConstants } from '../../../common/playerconstants';
import { ApplicationmodelService } from '../../../common/services/applicationmodel.service';
import { $ } from 'protractor';
import { ChangeContext, Options } from '@angular-slider/ngx-slider';
declare var Slider: any;


@Component({
	selector: 'app-video',
	templateUrl: './video.component.html',
	styleUrls: ['./video.component.scss'],
})

export class VideoComponent implements OnInit, AfterViewChecked {

	public appModel: ApplicationmodelService;
	public currentTime = 0;
	public displayVolume = false;
	public displaySpecial = false;
	public isPlaying = false;
	public time = PlayerConstants.TIME_FORMAT;

	protected sliderNewRef = null;
	protected testRef = null;

	private currentVideoTime;
	private duration;
	private videoDuration: any;

	private curmins = 0;
	private cursecs = 0;
	private curds = 0;
	private currentHit: any;
	private previousHit: any;
	private prehitFormat: any;
	private dsCollapse: any;
	private previousStopPoint;

	isAutoplayOn: boolean;
	text: any = "";

	sliderValue: any = 0;
	tooltipValue: string;

	volumeIcon: any = "";
	volumeMute: any = "";
	volumeBtn: any = "";
	timeArr: any = [];
	pauseFlag: boolean = false;
	loaderTimer: any;
	fadeOutFlag: boolean = false;
	isblink: boolean = false;
	timeInterval: any;
	zariBgInterval: any;

	isLastQues: boolean = false;
	isLastQuesAct: boolean;
	videoType: string = "video/ogg";
	isVideLoaded: boolean = false;
	videoSeekedFlag: boolean = false;
	isAssetsFound: boolean = false;
	isDrag: boolean = false;
	isForwardEnabled: boolean = true;

	videoProgress: any;
	isVideoPlaying: boolean = true;
	templateTypeEVA: boolean;
	root: any = document.documentElement;

	speakerPlayed: boolean;
	assets: any;
	assetsOnVideo: any;
	cuePoints: any;
	containgFolderPath: any = "";
	assetsPath: string = "";
	zarriRakheinBtn: any = "";
	evaWaves: boolean = false;
	speakerWaves: boolean = false;

	_optionsMaxLimit: number = 0;
	get optionsMaxLimit() {
		return this._optionsMaxLimit;
	}
	set optionsMaxLimit(value) {
		this._optionsMaxLimit = value;
	}

	options: Options = {
		floor: 0,
		ceil: 100,
		minLimit: 0,
		maxLimit: this._optionsMaxLimit,
		showTicks: false,
		hideLimitLabels: true,
		showSelectionBar: true,
		showOuterSelectionBars: true,
		animate: true,
		animateOnMove: false,
		keyboardSupport: false,
		enforceStep: false,
		enforceStepsArray: false
	};

	@ViewChild('mainVideo', { static: true }) mainVideo;
	@ViewChild('autoPlayOnOffContainer', { static: true }) autoPlayOnOffContainer: any;
	@ViewChild('videoOuterMost', { static: true }) videoOuterMost: any;
	@ViewChild('volumeContainer', { static: true }) volumeContainer: any;
	@ViewChild('MuteVar', { static: true }) MuteVar: any;
	@ViewChild('volumeBar', { static: true }) volumeBar: any;
	@ViewChild('speakerBtn', { static: true }) speakerBtn: any;
	@ViewChild('speakerBtn1', { static: true }) speakerBtn1: any;
	@ViewChild('quesRepeat', { static: true }) quesRepeat: any;
	@ViewChild('controlsContainer', { static: true }) controlsContainer: any;
	@ViewChild('sliderContainerNewRef', { static: true }) sliderContainerNewRef: any;
	@ViewChild('disableRange', { static: true }) disableRange: any;
	@ViewChild('zariRakheinBackground', { static: true }) zariRakheinBackground: any;
	@ViewChild('maxLimitfill', { static: true }) maxLimitfill: any;
	@ViewChild('maxLimitBlank', { static: true }) maxLimitBlank: any;
	@ViewChild('tooltipContainer', { static: true }) tooltipContainerRef: any;
	@HostListener('document:click', ['$event'])
	clickout(event) {
		if (!this.volumeContainer.nativeElement.contains(event.target)) {
			this.displayVolume = false;
		}
	}

	constructor(appModel: ApplicationmodelService) {
		this.appModel = appModel;
		this.appModel.navShow = 0;
		this.assetsPath = this.appModel.assetsfolderpath;

		this.appModel.setLoader(false);
		this.appModel.setVideoLoaded(false);
		setTimeout(() => {
			this.appModel.setVideoLoaded(true);
		}, 5000)

		this.appModel.notification.subscribe(
			(data) => {
				console.log('VideoComponent: constructor - data=', data);
				switch (data) {
					case PlayerConstants.CMS_PLAYER_PLAY:
						this.playVideo();
						break;

					case PlayerConstants.CMS_PLAYER_PAUSE:
						this.pauseVideo();
						break;

					case PlayerConstants.CMS_PLAYER_CLOSE:
						this.close();
						console.log('VideoComponent: constructor - cmsPlayerClose');
						break;

					default:
						console.log('VideoComponent: constructor - default');
						break;
				}
			}
		);
	}

	ngOnInit() {
		this.hideDefaultTooltip();
		this.showTooltip(false);
		this.containgFolderPath = this.getBasePath();
		console.log("containFolder =" + this.containgFolderPath);
		let imagesList = this.appModel.content.contentData.data['assets'];
		this.volumeIcon = imagesList.volume_graphic;
		this.volumeMute = imagesList.mute_graphic;
		this.volumeBtn = imagesList.volume_graphic;
		this.isLastQues = this.appModel.isLastSection;
		this.isLastQuesAct = this.appModel.isLastSectionInCollection;
		this.getTimeArr();
		this.setDynamicCss();

		this.appModel.getAutoPlay().subscribe((flag) => {
			if (flag) {
				this.autoPlayOnOffContainer.nativeElement.classList = "col-sm-1 hideAutoplay";
			} else {
				this.autoPlayOnOffContainer.nativeElement.classList = "col-sm-1";
			}
		});
		this.isForwardEnabled = false;
		if (this.isForwardEnabled) {
			this.maxLimitfill.nativeElement.style.display = "none";
			this.maxLimitBlank.nativeElement.style.display = "none";
		}

		let template = this.appModel.content.contentData.data['templateType'];
		if (template == "EVA") {
			this.templateTypeEVA = true;
		} else {
			this.templateTypeEVA = false;
		}
		this.assets = this.appModel.content.contentData.data['assets'];
		this.cuePoints = this.appModel.content.contentData.data['cuePoints'];
		if (this.appModel.getVideoType()) {
			this.videoType = this.appModel.getVideoType();
		}
		console.log("video type from backend" + this.videoType);

		if (this.videoOuterMost.nativeElement && this.videoOuterMost.nativeElement.parentElement
			&& this.videoOuterMost.nativeElement.parentElement.parentElement && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement
			&& this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement &&
			this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children) {
			//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderHeight";
		}

		if (this.appModel.isNewCollection) {
			//console.log("chck:",this.appModel.isNewCollection);
			//this.appModel.event = {'action': 'segmentBegins'};
			if (this.appModel.initVal == 0) {
				this.appModel.event = { 'action': 'segmentBegins' };
			}
			else {
				//this.appModel.event = {'action': 'play'};
				// play automatically from startAt milliseconds
				console.log('VideoComponent: ngOnInit - initVal', this.appModel.initVal);
				this.playVideoFrom(this.appModel.initVal);
			}

			let mLimit = this.duration;
			(this.maxLimitfill).nativeElement.style.width = mLimit + "%";
			(this.maxLimitBlank).nativeElement.style.width = (100 - mLimit) + "%";
		}
	}

	setDynamicCss() {
		let customeHeight: any = window.innerHeight / 112;
		this.root.style.setProperty('--sliderHeight', customeHeight + 'px');
		this.root.style.setProperty('--thumbMessurement', customeHeight * 2 + 'px');
	}

	checkImgLoaded() {
		setTimeout(() => {
			this.appModel.setVideoLoaded(true);
		}, 200)
	}

	onloadBlinkingButton() {
		this.timeInterval = setInterval(() => {
			this.onBlinkZariRahkeinBtn();
		}, 1000);
	}

	onloadzariMusicPlayer() {
		this.zariBgInterval = setInterval(() => {
			if (this.zariRakheinBackground && this.zariRakheinBackground.nativeElement) {
				this.zariRakheinBackground.nativeElement.play();
			}
		}, 1000);
	}

	getTimeArr() {
		if (this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data && this.appModel.content.contentData.data['cuePoints']) {
			for (let i in this.appModel.content.contentData.data['cuePoints']) {
				if (this.appModel.content.contentData.data['cuePoints'][i].time.lastIndexOf(":") != 8) {
					this.appModel.content.contentData.data['cuePoints'][i].time = this.appModel.content.contentData.data['cuePoints'][i].time + ":0";
				}
				this.timeArr.push(this.appModel.content.contentData.data['cuePoints'][i].time);
			}
		}
		console.log(this.timeArr);
	}

	getInitialVolume() {
		if (this.mainVideo && this.mainVideo.nativeElement) {
			this.mainVideo.nativeElement.volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
		}
		if (this.quesRepeat && this.quesRepeat.nativeElement) {
			this.quesRepeat.nativeElement.volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
		}
	}

	ngAfterViewChecked() {
		this.getInitialVolume();
	}

	loadedHandler(event) {
		this.duration = event.currentTarget.duration;
		const newOptions: Options = Object.assign({}, this.options);

		if (newOptions.ceil != undefined) {
			newOptions.ceil = this.duration.toFixed(0);
		}

		if (this.isForwardEnabled == true) {
			this._optionsMaxLimit = this.duration.toFixed(0);

			if (newOptions.maxLimit != undefined) {
				newOptions.maxLimit = this.duration.toFixed(0);
			}
		}

		this.options = newOptions;
	}

	updatePlay(event) {
		this.evaWaves = false;
		this.speakerWaves = false;
		this.speakerPlayed = false;
		this.isPlaying ? this.playVideo() : this.pauseVideo();

		console.log("updatePlay::this.isPlaying", this.isPlaying)

		if (!this.isPlaying) {
			this.fadeOutFlag = true;
			this.zariRakheinBackground.nativeElement.pause();
			this.zariRakheinBackground.nativeElement.currentTime = 0;
			clearTimeout(this.zariBgInterval);
			this.zariBgInterval = undefined;
			setTimeout(() => {
				this.fadeOutFlag = false;
				this.displaySpecial = false;
				clearInterval(this.timeInterval);
				this.timeInterval = undefined;
				this.isblink = undefined;
			}, 300)
		}
	}

	get basePath(): any {
		// console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content) {
			//this.volumeIcon = this.appModel.content.id;
			return this.appModel.content.id + '';
		}
	}

	get path(): string {
		if (this.appModel && this.appModel.content && this.appModel.content.id &&
			this.appModel.content.contentData && this.appModel.content.contentData.data) {
			return this.appModel.content.id + '/' + this.appModel.content.contentData.data['path'];
		}
		// console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
	}

	get sourceType(): string {
		// console.log('VideoComponent: sourceType=', this.appModel.content.contentData.data['type']);
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			return this.appModel.content.contentData.data['type'];
		}
	}

	get images(): any {
		// console.log('VideoComponent: path=', this.appModel.content.id + '/' + this.appModel.content.contentData.data['path']);
		if (this.appModel && this.appModel.content && this.appModel.content.contentData && this.appModel.content.contentData.data) {
			return this.appModel.content.contentData.data['assets'];
		}
	}

	volumeIconClicked(event) {
		this.displayVolume = !this.displayVolume;
		if (this.displayVolume) {
			setTimeout(() => {
				if (this.appModel) {
					let isMute = this.appModel.isMute;
					if (this.MuteVar && this.MuteVar.nativeElement) {
						if (isMute) {
							this.MuteVar.nativeElement.children[0].checked = true;
							this.appModel.isMute = true;
							this.volumeBar.nativeElement.className = "volumesliderDisable";
							this.appModel.functiontwo(undefined);
						} else if (!isMute) {
							this.MuteVar.nativeElement.children[0].checked = false;
							this.appModel.isMute = false;
							this.appModel.functiontwo(undefined);
						}
					}
				}
			}, 0)
		}
	}

	private playVideo(ct?: number) {
		if (this.quesRepeat && this.quesRepeat.nativeElement) {
			this.quesRepeat.nativeElement.pause();
			this.quesRepeat.nativeElement.currentTime = 0;
		}
		if (this.zariRakheinBackground && this.zariRakheinBackground.nativeElement) {
			this.zariRakheinBackground.nativeElement.pause();
			this.zariRakheinBackground.nativeElement.currentTime = 0;
		}
		/**/
		if (this.speakerBtn && this.speakerBtn.nativeElement) {
			this.speakerBtn.nativeElement.children[1].style.display = "none";
		}
		if (this.templateTypeEVA) {
			this.assets.speaker = this.assets.speaker_original;
		} else {
			this.speakerBtn.nativeElement.children[1].className = "speaker";
		}
		this.isPlaying = false;
		if (this.mainVideo && this.mainVideo.nativeElement) {
			if (ct) {
				this.currentTime = ct;
				this.mainVideo.nativeElement.currentTime = ct;
			}
			this.mainVideo.nativeElement.play();
		}
		this.appModel.event = { 'action': 'play' };
	}

	private pauseVideo() {
		this.isPlaying = true;
		if (this.mainVideo && this.mainVideo.nativeElement) {
			this.mainVideo.nativeElement.pause();
		}
		this.appModel.event = { 'action': 'pause', 'time': new Date().getTime(), 'currentPosition': this.mainVideo.nativeElement.currentTime };
	}

	updateHandler(event) {
		if (this.isDrag == true) {
			return;
		}

		let vct = event.currentTarget.currentTime.toFixed(0);
		
		let strTime = (vct).toString().substr(0, ((vct).toString().indexOf(".") + 2));
		let duration = event.currentTarget.duration.toFixed(0);

		this.currentHit = vct;
		this.curds = strTime[strTime.length - 1];
		this.currentVideoTime = vct;

		this.sliderValue = vct;

		this.zarriRakheinBtn = "";

		this.curmins = Math.floor(vct / 60);
		this.cursecs = Math.floor(vct - this.curmins * 60);

		let durmins = Math.floor(duration / 60);
		let dursecs = Math.floor(duration - durmins * 60);
		let ttime = dursecs + (durmins * 60);
		let ctime = this.cursecs + (this.curmins * 60);
		let rtime = ttime - ctime;
		let remainingt = this.convertDigits(Math.floor(rtime / 60)) + ':' + this.convertDigits(rtime % 60);
		let elapsed = this.convertDigits(this.curmins) + ':' + this.convertDigits(this.cursecs) + ':' + this.curds;

		this.time = remainingt + ' / ' + this.convertDigits(durmins) + ':' + this.convertDigits(dursecs);
		this.isAssetsFound = false;

		let dsDiff: any = this.getDiffrence(this.prehitFormat, this.currentHit, this.previousHit);
		if (dsDiff && dsDiff.length <= 0) {
			let timeArr: any = [];
			timeArr.push(elapsed);
			dsDiff = timeArr;
		}

		if (dsDiff && dsDiff.length > 0) {
			for (let i = dsDiff.length - 1; i >= 0; i--) {
				if ((this.timeArr.indexOf('00:' + dsDiff[i]) != -1) && (this.previousStopPoint != this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])])) {
					this.assetsOnVideo = this.cuePoints[this.timeArr.indexOf('00:' + dsDiff[i])];
					this.pauseFlag = true;
					this.displaySpecial = true;
					/*blink Button Status*/
					if ((!this.assetsOnVideo.isBlink) || (this.assetsOnVideo.isBlink == undefined)) {
						this.normalZariRahkeinBtn();
					}
					else {
						this.onloadBlinkingButton();
					}
					console.log("Zari Rahkein Audio Playaer Status=" + this.assetsOnVideo.zariSound);
					/*Audio Player Status*/
					if ((this.assetsOnVideo.zariSound != "") && (this.assetsOnVideo.zariSound != undefined)) {
						this.onloadzariMusicPlayer();
					}

					this.previousStopPoint = this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])];


					if (!this.mainVideo.nativeElement.paused) {
						console.log("this.mainVideo.nativeElement.pause()");
						this.mainVideo.nativeElement.pause();
						this.isPlaying = true;
					}

					console.log("pause at ", dsDiff[i]);
					console.log("pause at... new ", this.timeArr[this.timeArr.indexOf('00:' + dsDiff[i])]);
					this.isAssetsFound = true;
					break;
				}
			}
		}

		if (!this.isAssetsFound && this.videoSeekedFlag) {
			this.displaySpecial = false;
			clearInterval(this.timeInterval);
			this.timeInterval = undefined;
			this.isblink = undefined;
		}

		this.prehitFormat = elapsed;
		this.videoSeekedFlag = false;
	}

	getDiffrence(preHit, next, pre) {
		let timeArrNew: any = [];
		let timeDiff = Math.ceil((next - pre) * 10);
		if (preHit && !this.videoSeekedFlag) {
			let preDS = preHit[preHit.lastIndexOf(':') + 1];
			let preS = preHit.substr(preHit.lastIndexOf(':') - 2, 2);
			let preM = preHit.substr(0, preHit.indexOf(':'));
			let timeInFormat: any;
			for (let i = 0; i < timeDiff; i++) {
				preDS = +preDS + + 1;
				if (preDS > 9) {
					preS = +preS + + Math.floor(preDS / 10);
					preDS = preDS % 10;
					if (preS > 59) {
						preM = +preM + +Math.floor(preS / 60);
						preS = preS % 60;
					}
				}
				timeInFormat = (this.convertDigitsCal(preM) + ':' + this.convertDigitsCal(preS) + ':' + preDS);
				if (this.dsCollapse == timeInFormat) {
				}
				if ((this.dsCollapse && this.dsCollapse != timeInFormat) || !this.dsCollapse) {
					timeArrNew.push(timeInFormat);
				}
			}
		} else {
			console.log("getDiffrence::preHit:" + preHit + ", next:" + next + ", pre:" + pre);
			if (next != pre) {
				console.log("video seeking flag true");
				setTimeout(() => {
					this.zariRakheinBackground.nativeElement.pause();
					this.zariRakheinBackground.nativeElement.currentTime = 0;
					clearTimeout(this.zariBgInterval);
					this.zariBgInterval = undefined;
				}, 500);
			}

		}
		this.previousHit = this.currentHit;
		if (timeArrNew && timeArrNew.length && timeArrNew[timeArrNew.length - 1]) {
			this.dsCollapse = timeArrNew[timeArrNew.length - 1];
		}
		return timeArrNew;
	}

	videoSeeked(event) {
		let vct = event.currentTarget.currentTime.toFixed(0);
		const newOptions: Options = Object.assign({}, this.options);

		console.log("videoSeeked::" + vct + "=" + newOptions.maxLimit);
		this.videoSeekedFlag = true;
		this.previousStopPoint = -1;
		if (vct != newOptions.maxLimit) {
			console.log("video seeking from video seeked");
			this.zariRakheinBackground.nativeElement.pause();
			this.zariRakheinBackground.nativeElement.currentTime = 0;
			clearTimeout(this.zariBgInterval);
			this.zariBgInterval = undefined;
		}
	}

	convertDigitsCal(value: string): string {
		if (value.toString().length < 2) {
			return '0' + value;
		} else {
			return '' + value;
		}
	}

	resumeSpecial(event) {
		console.log('VideoComponent: resumeSpecial - event=', event);
		setTimeout(() => {
			this.zariRakheinBackground.nativeElement.pause();
			this.zariRakheinBackground.nativeElement.currentTime = 0;
			clearTimeout(this.zariBgInterval);
			this.zariBgInterval = undefined;
		}, 500);

		this.updatePlay("t");
		//this.displaySpecial = false;
		//this.assetsOnVideo = "";
	}

	updateVolume(event) {

		console.log('VideoComponent: updateVolume - event=', event);
		if (this.mainVideo && this.mainVideo.nativeElement) {
			this.mainVideo.nativeElement.volume = this.appModel.isMute ? 0 : event.target.value;
			if (this.quesRepeat && this.quesRepeat.nativeElement) {
				this.quesRepeat.nativeElement.volume = this.appModel.isMute ? 0 : event.target.value;
			}
			if (this.zariRakheinBackground && this.zariRakheinBackground.nativeElement) {
				this.zariRakheinBackground.nativeElement.volume = this.appModel.isMute ? 0 : event.target.value;
			}
			this.appModel.functiontwo(event.target.value);
			if (this.MuteVar.nativeElement.children[0].checked) {
				this.MuteVar.nativeElement.children[0].checked = false;
				this.appModel.isMute = false;
				this.volumeBtn = this.volumeIcon;
				this.volumeBar.nativeElement.className = "volumeslider";
			}
			if (event.target.value == 0) {
				this.appModel.isMute = true;
				this.MuteVar.nativeElement.children[0].checked = true;
				this.volumeBtn = this.volumeMute;
				this.volumeBar.nativeElement.className = "volumesliderDisable";
			}
		}
	}

	UpdateMute(event) {
		console.log(event);
		if (this.MuteVar.nativeElement.children[0].checked) {
			this.appModel.isMute = true;
			this.volumeBtn = this.volumeMute;
			this.volumeBar.nativeElement.className = "volumesliderDisable";
			if (this.mainVideo && this.mainVideo.nativeElement) {
				this.mainVideo.nativeElement.volume = this.appModel.isMute ? 0 : this.appModel.volumeValue;
			}
			if (this.quesRepeat && this.quesRepeat.nativeElement) {
				this.quesRepeat.nativeElement.volume = this.appModel.isMute ? 0 : event.target.value;
			}
			if (this.zariRakheinBackground && this.zariRakheinBackground.nativeElement) {
				this.zariRakheinBackground.nativeElement.volume = this.appModel.isMute ? 0 : event.target.value;
			}
		} else {
			this.appModel.isMute = false;
			this.volumeBtn = this.volumeIcon;
			this.volumeBar.nativeElement.className = "volumeslider";
			if (this.mainVideo && this.mainVideo.nativeElement) {
				this.mainVideo.nativeElement.volume = this.appModel.volumeValue;
			}
			if (this.quesRepeat && this.quesRepeat.nativeElement) {
				this.quesRepeat.nativeElement.volume = this.appModel.volumeValue;
			}

			if (this.zariRakheinBackground && this.zariRakheinBackground.nativeElement) {
				this.zariRakheinBackground.nativeElement.volume = this.appModel.volumeValue;
			}
		}
	}

	endedHandler(event) {
		console.log('VideoComponent: endedHandler');
		this.appModel.event = { 'action': 'segmentEnds' };
		this.isPlaying = true;
		if ((this.appModel.autoPlay && !this.isLastQues) || !((this.isLastQuesAct)) || ((this.isLastQuesAct && this.appModel.autoPlay && !this.isLastQues))) {
			if (this.videoOuterMost && this.videoOuterMost.nativeElement
				&& this.videoOuterMost.nativeElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement
				&& this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
				//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "container-fluid d-flex align-items-center justify-content-center";
				//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderTest";
			}
			//this.appModel.setLoader(true);
			this.appModel.nextSection();
		} else if (!this.appModel.autoPlay && !this.isLastQues) {
			this.zarriRakheinBtn = this.assets.nextbtn_graphic;
		} else if (this.isLastQues) {
			this.appModel.event = { 'action': 'end' };
		}
	}

	onHoverContinuousBtn() {
		this.zarriRakheinBtn = this.assets.nextbtn_graphic_hover;
	}

	onLeaveContinuousBtn() {
		this.zarriRakheinBtn = this.assets.nextbtn_graphic_original;
	}

	onBlinkZariRahkeinBtn() {
		let Zaari = document.getElementById("cteBtn");
		if (this.isblink) {
			//Zaari.sr= this.assets.nextbtn_graphic_hover;
			let location1 = this.assets.nextbtn_graphic.location;
			console.log("location1=" + location1);
			if (location1 == "content") {
				let imgUrl = (this.containgFolderPath + "/" + this.assets.nextbtn_graphic_hover.url);
				Zaari.setAttribute('src', imgUrl);
			} else {
				Zaari.setAttribute('src', this.assets.nextbtn_graphic_hover.url);
			}
			this.isblink = false;
		} else {
			let location2 = this.assets.nextbtn_graphic_original.location;
			if (location2 == "content") {
				let imgUrl = (this.containgFolderPath + "/" + this.assets.nextbtn_graphic_original.url);
				Zaari.setAttribute('src', imgUrl);
			}
			else {
				Zaari.setAttribute('src', this.assets.nextbtn_graphic_original.url);
			}
			this.isblink = true;
		}
	}

	normalZariRahkeinBtn() {
		let Zaari = document.getElementById("cteBtn");
		let location1 = this.assets.nextbtn_graphic_original.location;
		if (location1 == "content") {
			let imgUrl = (this.containgFolderPath + "/" + this.assets.nextbtn_graphic_original.url);
			Zaari.setAttribute('src', imgUrl);
		} else {
			Zaari.setAttribute('src', this.assets.nextbtn_graphic_original.url);
		}
	}

	onHoverSpeakerBtn() {
		this.assets.speaker = this.assets.speaker_hover;
	}

	onLeaveSpeakerBtn() {
		if (!this.speakerPlayed) {
			this.assets.speaker = this.assets.speaker_original;
		}
	}

	onHoverReplayBtn() {
		this.assets.replay = this.assets.replay_hover;
	}

	onLeaveReplayBtn() {
		this.assets.replay = this.assets.replay_original;
	}

	next() {
		if (!this.isLastQues) {
			if (this.videoOuterMost && this.videoOuterMost.nativeElement
				&& this.videoOuterMost.nativeElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement
				&& this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
				//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "container-fluid d-flex align-items-center justify-content-center";
				//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderTest";
			}
			this.fadeOutFlag = true;
			setTimeout(() => {
				//this.zarriRakheinBtn = "";
				//this.appModel.setLoader(true);
				this.appModel.nextSection();
				//this.fadeOutFlag = false;
			}, 200)
		}
	}

	playVideoFrom(millisecs: number) {
		// play from milliseconds 
		this.playVideo(millisecs);
		console.log(millisecs);
		//this.mainVideo.nativeElement.currentTime=millisecs;
		//console.log("newStart:",millisecs,this.mainVideo.nativeElement.currentTime);
	}

	close() {
		this.appModel.event = { 'action': 'exit', 'time': new Date().getTime(), 'currentPosition': this.mainVideo.nativeElement.currentTime };
	}

	convertDigits(value: number): string {
		if (value < 10) {
			return '0' + value;
		} else {
			return '' + value;
		}
	}

	checkVideoLoaded() {
		this.controlsContainer.nativeElement.style.display = "flex";
		//this.appModel.setLoader(false);
		if (this.videoOuterMost.nativeElement && this.videoOuterMost.nativeElement.parentElement
			&& this.videoOuterMost.nativeElement.parentElement.parentElement && this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement
			&& this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement &&
			this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children) {
			//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "";
			//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.children[2].className = "loaderHeight";
		}
		//clearTimeout(this.loaderTimer);

		setTimeout(() => {
			if (this.appModel) {
				let autoPlay = this.appModel.isAutoPlay();
				if (autoPlay) {
					if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]) {
						this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = true;
						this.isAutoplayOn = true;
						this.appModel.updateAutoPlay(true);
					}
				} else {
					if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]) {
						this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked = false;
						this.isAutoplayOn = false;
						this.appModel.updateAutoPlay(false);
					}
				}
				let isMute = this.appModel.isMute;
				if (isMute) {
					this.volumeBtn = this.volumeMute;
				} else if (!isMute) {
					this.volumeBtn = this.volumeIcon;
				}
			}

			if (this.videoOuterMost && this.videoOuterMost.nativeElement
				&& this.videoOuterMost.nativeElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement &&
				this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement
				&& this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement) {
				//this.videoOuterMost.nativeElement.parentElement.parentElement.parentElement.parentElement.parentElement.className = "";
			}
		}, 100)
		this.isVideLoaded = true;

		this.appModel.setVideoLoaded(true);
		this.videoDuration = this.mainVideo.nativeElement.duration;
	}

	updateAutoplay() {
		if (this.autoPlayOnOffContainer && this.autoPlayOnOffContainer.nativeElement && this.autoPlayOnOffContainer.nativeElement.children[0] && this.autoPlayOnOffContainer.nativeElement.children[0].children[1]) {
			if (this.autoPlayOnOffContainer.nativeElement.children[0].children[1].checked) {
				this.isAutoplayOn = true;
				this.appModel.updateAutoPlay(true);
			} else {
				this.isAutoplayOn = false;
				this.appModel.updateAutoPlay(false);
			}
		}
	}

	getBasePath() {
		if (this.appModel && this.appModel.content) {
			return this.appModel.content.id + '';
		}
	}

	onHoverZariRakheinBtn() {
		let Zaari = document.getElementById("cteBtn");
		let location1 = this.assets.nextbtn_graphic_hover.location;
		if (location1 == "content") {
			let imgUrl = (this.containgFolderPath + "/" + this.assets.nextbtn_graphic_hover.url);
			Zaari.setAttribute('src', imgUrl);
		} else {
			Zaari.setAttribute('src', this.assets.nextbtn_graphic_hover.url);
		}
		//this.assets.nextbtn_graphic = this.assets.nextbtn_graphic_hover;
	}

	onLeaveZariRakheinBtn() {
		let Zaari = document.getElementById("cteBtn");
		let location1 = this.assets.nextbtn_graphic_original.location;
		if (location1 == "content") {
			let imgUrl = (this.containgFolderPath + "/" + this.assets.nextbtn_graphic_original.url);
			Zaari.setAttribute('src', imgUrl);
		} else {
			Zaari.setAttribute('src', this.assets.nextbtn_graphic_original.url);
		}
		//this.assets.nextbtn_graphic = this.assets.nextbtn_graphic_original;
	}

	repeatQues() {
		if (this.templateTypeEVA) {
			this.speakerPlayed = true;
			this.assets.speaker = this.assets.speaker_hover;
			this.evaWaves = true;
			//  this.speakerBtn.nativeElement.children[1].style.display="flex";
			if (this.assetsOnVideo) {
				this.quesRepeat.nativeElement.play();
				this.quesRepeat.nativeElement.onended = () => {
					this.speakerPlayed = false;
					this.evaWaves = false;
					this.assets.speaker = this.assets.speaker_original;
					this.speakerBtn.nativeElement.children[1].style.display = "none";
				}
			}
		} else {
			this.speakerWaves = true;
			//   this.speakerBtn.nativeElement.children[1].className = "speaker dispFlex";
			if (this.assetsOnVideo) {
				this.quesRepeat.nativeElement.play();
				this.quesRepeat.nativeElement.onended = () => {
					this.speakerWaves = false;
					this.speakerBtn.nativeElement.children[1].className = "speaker";
				}
			}
		}
	}

	replayVideo() {
		this.mainVideo.nativeElement.currentTime = this.assetsOnVideo.replaytime;
		this.mainVideo.nativeElement.play();
		this.isPlaying ? this.playVideo() : this.pauseVideo();
	}

	showValueOnTooltip(event) {
		let calValue = 0;
		let tooltipRef = this.tooltipContainerRef.nativeElement.children[0];
		let tooltipWidth = tooltipRef.getBoundingClientRect().width;

		if (event.target.attributes[1].name == "ngxsliderhandle") {
			calValue = (this.videoDuration * (parseInt(event.target.style.left) + event.offsetX) / event.currentTarget.clientWidth);
			tooltipRef.style.left = (parseInt(event.target.style.left) + event.offsetX) - tooltipWidth / 2 + "px";
		} else {
			calValue = (this.videoDuration * event.offsetX / event.currentTarget.clientWidth);
			tooltipRef.style.left = event.offsetX - tooltipWidth / 2 + "px";
		}

		this.tooltipValue = this.formatTime(calValue);
		this.showTooltip(true);
	}

	hideDefaultTooltip() {
		if (this.sliderContainerNewRef.nativeElement && this.sliderContainerNewRef.nativeElement.children[0] && this.sliderContainerNewRef.nativeElement.children[0].children[8]) {
			this.sliderContainerNewRef.nativeElement.children[0].children[8].style.display = "none !important";
			this.sliderContainerNewRef.nativeElement.children[0].children[8].style.visibility = "hidden !important";
		}
	}

	showTooltip(value: boolean) {
		if (value == true) {
			this.tooltipContainerRef.nativeElement.style.visibility = "visible";
		} else {
			this.tooltipContainerRef.nativeElement.style.visibility = "hidden";
		}
	}

	onUserChangeStart(changeContext: ChangeContext): void {
		//this.mainVideo.nativeElement.pause();

		console.log("onUserChangeStart::" + changeContext.value);

		if (this.mainVideo.nativeElement.paused) {
			this.isVideoPlaying = false;
		} else {
			this.isVideoPlaying = true;
			this.mainVideo.nativeElement.pause();
		}

		this.isDrag = true;
	}

	onUserChangeEnd(changeContext: ChangeContext): void {
		let value: number = changeContext.value;
		console.log("onUserChangeEnd::changeContext.value=" + changeContext.value + ", value=" + value);

		this.currentTime = value;

		if (this.isVideoPlaying) {
			this.mainVideo.nativeElement.play();
		}

		this.isDrag = false;
	}

	formatTime(value: number): string {
		if (value < 0) {
			value = 0;
		}

		let mouseoverminute = Math.floor(value / 60);
		let mouseoversecond = parseInt((value - mouseoverminute * 60).toFixed(0));
		if (mouseoversecond == 60) {
			mouseoverminute++;
			mouseoversecond = 0;
		}

		let strTime: string = this.convertDigits(mouseoverminute) + ':' + this.convertDigits(mouseoversecond);
		//console.log(strTime);
		return strTime;
	}

	valueChangeEvent(event) {
		if (this.isForwardEnabled == false) {
			let mLimit =  event;
			let value1: number = 0;
			const newOptions: Options = Object.assign({}, this.options);

			//console.log("VCE::mLimit:" + mLimit + ", currentVideoTime:" + this.currentVideoTime);
			if (newOptions.maxLimit != undefined) {
				value1 = newOptions.maxLimit;
			}

			if (mLimit > value1) {
				if (newOptions.maxLimit != undefined) {
					newOptions.maxLimit = mLimit;
				}

				(this.maxLimitfill).nativeElement.style.width = mLimit / this.duration * 100 + "%";
				(this.maxLimitBlank).nativeElement.style.width = (100 - ((mLimit / this.duration) * 100)) + "%";


				this.options = newOptions;
			}
		} else {
			const newOptions: Options = Object.assign({}, this.options);
			if (newOptions.maxLimit != undefined) {
				newOptions.maxLimit = this.duration;
			}
			this.options = newOptions;
		}
	}
}