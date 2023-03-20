export class Helper {

  constructor(isDownloaded:boolean, startAt: number, segmentId: number, file: string, isCompleted: boolean, fileIcon:string, chapterName:string, shortCode:string, description:string) {
    this._isDownloaded=isDownloaded;
    this._startAt = startAt;
    this._segmentId = segmentId;
    this._file = file;
    this._isCompleted = isCompleted;
    this._fileIcon=fileIcon;
    this._chapterName=chapterName;
    this._shortCode=shortCode;
    this._description=description;
  }

  private _isDownloaded: boolean;

  get isDownloaded(): boolean {
    return this._isDownloaded;
  }
  private _startAt: number;

  get startAt(): number {
    return this._startAt;
  }

  private _segmentId: number;

  get segmentId(): number {
    return this._segmentId;
  }

  private _file: string;

  get file(): string {
    return this._file;
  }

  private _fileIcon: string;

  get fileIcon(): string {
    return this._fileIcon;
  }

  private _chapterName: string;

  get chapterName(): string {
    return this._chapterName;
  }

  private _shortCode: string;

  get shortCode(): string {
    return this._shortCode;
  }

  private _description: string;

  get description(): string {
    return this._description;
  }

  private _isCompleted: boolean;

  get isCompleted(): boolean {
    return this._isCompleted;
  }
}

export class Info {

  constructor(id: string, data: any) {
    this._id = id;
    this._data = data;
  }

  private _id: string;

  get id(): string {
    return this._id;
  }

  private _data: any;

  get data(): any {
    return this._data;
  }

}

export class InitializationAPI {

  constructor(homePath: string, forwardEnabled: boolean, autoPlay:boolean, playerPreview: boolean, videoType: string, sessionId: string, files: Array<Helper>) {
    this._homePath = homePath;
    this._forwardEnabled = forwardEnabled;
    this._autoPlay = autoPlay;
    this._playerPreview = playerPreview;
    this._videoType = videoType;
    this._sessionId = sessionId;
    this._files = files;
  }

  private _homePath: string;

  get homePath(): string {
    return this._homePath;
  }
  private _autoPlay: boolean;
  private _forwardEnabled: boolean;
 
  get autoPlayEnabled(): boolean {
    return this._autoPlay;
  }
  get forwardEnabled(): boolean {
    return this._forwardEnabled;
  }
  private _playerPreview: boolean;

  private _videoType: string;

  get playerPreview(): boolean {
    return this._playerPreview;
  }

  get videoType(): string {
    return this._videoType;
  }

  private _sessionId: string;

  get sessionId(): string {
    return this._sessionId;
  }

  private _files: Array<Helper>;

  get files(): Array<Helper> {
    return this._files;
  }

}
