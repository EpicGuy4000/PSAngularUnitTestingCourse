import { HeroesComponent } from "./heroes.component";
import { Hero } from "../hero";
import { HeroService } from "../hero.service";
import { Observable, of } from "rxjs";

describe('HeroesComponent', () => {
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
  })
})
