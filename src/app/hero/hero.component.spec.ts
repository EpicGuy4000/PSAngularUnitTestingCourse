import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { By } from "@angular/platform-browser";
import { RouterTestingModule } from "@angular/router/testing";

describe("HeroComponent", () => {
  describe("=Shallow=", () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ HeroComponent ],
        imports: [ RouterTestingModule.withRoutes([])]
      });
      fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
      fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};

      expect(fixture.componentInstance.hero.name).toEqual('SuperDude');
    });

    it('should render the hero name in an anchor tag', () => {
      fixture.componentInstance.hero = { id: 1, name: 'SuperDude', strength: 3};
      fixture.detectChanges();

      // Using Debug Element
      expect(fixture.debugElement.query(By.css('a')).nativeElement.textContent).toContain('SuperDude');

      // Using DOM
      // expect(fixture.nativeElement.querySelector('a').textContent).toContain('SuperDude');
    });
  });
});
