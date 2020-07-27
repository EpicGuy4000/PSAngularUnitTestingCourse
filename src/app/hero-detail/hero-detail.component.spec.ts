import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import SpyObj = jasmine.SpyObj;
import { Location } from "@angular/common";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { Hero } from "../hero";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', () => {
  let mockActivatedRoute: any, mockHeroService: SpyObj<HeroService>, mockLocation: SpyObj<Location>;

  let fixture: ComponentFixture<HeroDetailComponent>;

  beforeEach(() => {
    mockHeroService = jasmine.createSpyObj<HeroService>('HeroService', [ 'getHero', 'updateHero' ]);
    mockLocation = jasmine.createSpyObj('Location', ['back']);
    mockActivatedRoute = {
      snapshot: { paramMap: { get: () => { return "3"; }}}
    };

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ HeroDetailComponent ],
      providers: [
        {
          provide: HeroService,
          useValue: mockHeroService
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide: Location,
          useValue: mockLocation
        }
      ]
    });

    fixture = TestBed.createComponent<HeroDetailComponent>(HeroDetailComponent);
    mockHeroService.getHero.and.returnValue(of<Hero>({ id: 3, name: 'SuperDude', strength:100 }));
  });

  it('should render hero name in a h2 tag', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h2').textContent).toContain('SUPERDUDE');
  });
})
