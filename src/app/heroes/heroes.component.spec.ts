import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { Observable, of } from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Input } from "@angular/core";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";
import { RouterModule } from "@angular/router";

describe('HeroesComponent', () => {
  describe("=Shallow=", () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService: jasmine.SpyObj<HeroService>;
    const HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 20},
      {id: 3, name: 'SuperDude', strength: 100},
    ];

    @Component({
      selector: 'app-hero',
      template: '<div></div>',
    })
    class FakeHeroComponent {
      @Input() hero: Hero;
    }

    beforeEach(() => {
      mockHeroService = jasmine.createSpyObj('HeroService', [ 'getHeroes', 'addHero', 'deleteHero' ]);

      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          FakeHeroComponent
        ],
        providers: [ {
          provide: HeroService,
          useValue: mockHeroService
        }]
      });
      fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should set heroes correctly from the service', () => {
      mockHeroService.getHeroes.and.returnValue(of<Hero[]>(HEROES));
      fixture.detectChanges();

      expect(fixture.componentInstance.heroes).toEqual(HEROES);
    });

    it('should should create one li for each hero', () => {
      mockHeroService.getHeroes.and.returnValue(of<Hero[]>(HEROES));
      fixture.detectChanges();

      expect(fixture.debugElement.queryAll(By.css('li')).length).toBe(3);
    })
  });

  describe('=Isolation=', () => {
    let component: HeroesComponent;
    let HEROES: Hero[];
    let mockHeroService: jasmine.SpyObj<HeroService>;

    beforeEach(() => {
      HEROES = [
        {id: 1, name: 'SpiderDude', strength: 8},
        {id: 2, name: 'Wonderful Woman', strength: 20},
        {id: 3, name: 'SuperDude', strength: 100},
      ];

      mockHeroService = jasmine.createSpyObj<HeroService>('HeroService', ['getHeroes', 'addHero', 'deleteHero']);

      component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {
      it('should remove the indicated hero from the heroes list', () => {
        mockHeroService.deleteHero.and.returnValue(of<Hero>(HEROES[2]));
        component.heroes = HEROES;

        component.delete(HEROES[2]);

        expect(component.heroes).not.toContain(HEROES[2]);
      });

      it('should call deleteHero', () => {
        mockHeroService.deleteHero.and.returnValue(of<Hero>(HEROES[2]));
        component.heroes = HEROES;

        component.delete(HEROES[2]);

        expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
      });

      it('should subscribe to deleteHero return observable', () => {
        let observableHero = jasmine.createSpyObj<Observable<Hero>>('deleteHeroReturn', [ 'subscribe' ]);
        mockHeroService.deleteHero.and.returnValue(observableHero);
        component.heroes = HEROES;

        component.delete(HEROES[2]);

        expect(observableHero.subscribe).toHaveBeenCalled();
      });
    });
  });
});
