import { ComponentFixture, TestBed, TestModuleMetadata, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(waitForAsync(() => {
        const metadata: TestModuleMetadata = {
            declarations: [AppComponent],
            imports: [RouterTestingModule]
        };

        TestBed
            .configureTestingModule(metadata)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    it("should create AppComponent", () => {
        // act
        const app = fixture.componentInstance;

        // assert
        expect(app).toBeTruthy();
    });

    it("should have the title 'utopía'", () => {
        // act
        const actual = fixture.componentInstance.title;

        // expected
        const expected = 'utopía';

        expect(actual).toEqual(expected);
    });

    it("should render 'Utopía'", () => {
        // arrange
        const nativeElement = fixture.nativeElement;

        // act
        const actual = nativeElement.querySelector('a.navbar-brand').textContent;

        // assert
        const expected = 'Utopía';

        expect(actual).toBe(expected);
    });
});
