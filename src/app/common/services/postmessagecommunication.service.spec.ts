import { TestBed } from '@angular/core/testing';

import { PostmessagecommunicationService } from './postmessagecommunication.service';

describe('PostmessagecommunicationService', () => {
  let service: PostmessagecommunicationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostmessagecommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
