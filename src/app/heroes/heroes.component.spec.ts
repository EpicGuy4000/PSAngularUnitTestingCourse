import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { Observable, of } from "rxjs";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Component, Directive, Input } from "@angular/core";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

@Directive({
  selector: '[routerLink]',
  host: { '(click)': 'onClick()'}
})
class RouterLinkDirectiveStub {
  @Input('routerLink') linkParams: any;
  navigatedTo: any = null;

  onClick() {
    this.navigatedTo = this.linkParams;
  }
}

describe('HeroesComponent', () => {
  let fixture: ComponentFixture<HeroesComponent>;
  let mockHeroService: jasmine.SpyObj<HeroService>;
  let HEROES : Hero[];

  beforeEach(() => {
    HEROES = [
      {id: 1, name: 'SpiderDude', strength: 8},
      {id: 2, name: 'Wonderful Woman', strength: 20},
      {id: 3, name: 'SuperDude', strength: 100},
    ];
  });

  describe("=Deep=", () => {
    beforeEach(() => {
      mockHeroService = jasmine.createSpyObj('HeroService', [ 'getHeroes', 'addHero', 'deleteHero' ]);

      TestBed.configureTestingModule({
        declarations: [
          HeroesComponent,
          HeroComponent,
          RouterLinkDirectiveStub
        ],
        providers: [ {
          provide: HeroService,
          useValue: mockHeroService
        }]
      });
      fixture = TestBed.createComponent(HeroesComponent);
    });

    it('should render each hero as a HeroComponent', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      // run ngOnInit
      fixture.detectChanges();

      const heroComponentDEs = fixture.debugElement.queryAll(By.directive(HeroComponent));
      expect(heroComponentDEs.map(de => de.componentInstance as HeroComponent).map(hc => hc.hero)).toEqual(HEROES);
    });

    it(`should call HeroSevice.deleteHero
      when the Hero Component's delete button is clicked`, () => {
      spyOn(fixture.componentInstance, 'delete');
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
      heroComponents[0]
        .query(By.css('button'))
        .triggerEventHandler('click', jasmine.createSpyObj<Event>(['stopPropagation']));

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it(`should call HeroSevice.deleteHero
      when the Hero Component's delete event is raised`, () => {
      spyOn(fixture.componentInstance, 'delete');
      mockHeroService.getHeroes.and.returnValue(of(HEROES));

      fixture.detectChanges();

      const heroComponent = fixture.debugElement.queryAll(By.directive(HeroComponent))[0];
      heroComponent.triggerEventHandler('delete', undefined);

      expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    it('should add a new hero to the hero list when the add button is clicked', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();
      const name = 'Mr Ice';
      mockHeroService.addHero.and.callFake((hero: Hero) => {
        return of({ id: 5, name: hero.name, strength: hero.strength });
      });
      const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      const addButton = fixture.debugElement.query(By.css('button:first-of-type'));

      inputElement.value = name;
      addButton.triggerEventHandler('click', null);
      fixture.detectChanges();

      const heroText = fixture.debugElement.query(By.css('ul')).nativeElement.textContent;
      expect(heroText).toContain(name);
    });

    it('should have the correct route for the first hero', () => {
      mockHeroService.getHeroes.and.returnValue(of(HEROES));
      fixture.detectChanges();
      const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

      let routerLink = heroComponents[0]
        .query(By.directive(RouterLinkDirectiveStub))
        .injector.get(RouterLinkDirectiveStub);

      heroComponents[0].query(By.css('a')).triggerEventHandler('click', null);

      fixture.detectChanges();
      expect(routerLink.navigatedTo).toEqual('/detail/1');
    })
  });

  describe("=Shallow=", () => {

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
    let mockHeroService: jasmine.SpyObj<HeroService>;

    beforeEach(() => {
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
