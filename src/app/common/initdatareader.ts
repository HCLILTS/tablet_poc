import { InitializationAPI, Helper } from './initializationapi';
export class InitDataReader {
  constructor() {

  }

  read(data): InitializationAPI {


    console.log('InitDataReader: read', data);

    if (
      data == null
      || data.homePath == null
      || data.forwardEnabled == null
      || data.autoPlay == null
      || data.playerPreview == null
      || data.sessionId == null
      || data.files == null
      || data.files.length <= 0
    ) {
      throw new Error('Invalid data');
    }

    const initHelperCollection: Array<Helper> = new Array<Helper>();
    for (let i = 0; i < data.files.length; i++) {
      const inithelper: Helper = new Helper(data.files[i].isDownloaded,
        data.files[i].startAt, data.files[i].segmentId, data.files[i].file, data.files[i].isCompleted,data.files[i].fileIcon,data.files[i].chapterName,data.files[i].shortCode,data.files[i].description);
      initHelperCollection.push(inithelper);
    }
    return new InitializationAPI(data.homePath, data.forwardEnabled, data.autoPlay, data.playerPreview, data.videoType, data.sessionId, initHelperCollection);

  }
}
