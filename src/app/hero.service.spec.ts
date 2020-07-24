import { TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('HeroService', () => {
  let mockMessageService: jasmine.SpyObj<MessageService>;
  let httpTestingController: HttpTestingController;
  let service: HeroService;

  beforeEach(() => {
    mockMessageService = jasmine.createSpyObj('MessageService',['add'])

    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: MessageService, useValue: mockMessageService }
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.inject(HeroService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  describe('getHero', async () => {
    it('should get with the correct URL', () => {
      const heroToReturn = {id: 1, name: 'SuperDude', strength: 100};

      service.getHero(1).subscribe((hero) => {
        expect(hero).toEqual(heroToReturn)
      });

      const req = httpTestingController.expectOne('api/heroes/1');
      req.flush(heroToReturn);

      httpTestingController.verify();
    });
  });
});
