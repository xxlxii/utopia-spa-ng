import { waitForAsync, ComponentFixture, TestBed, TestModuleMetadata } from '@angular/core/testing';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
    let component: ContactComponent;
    let fixture: ComponentFixture<ContactComponent>;

    beforeEach(waitForAsync(() => {
        const metadata: TestModuleMetadata = {
            declarations: [ContactComponent]
        };

        TestBed
            .configureTestingModule(metadata)
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ContactComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create ContactComponent', () => {
        // assert
        const actual = component;

        expect(actual).toBeTruthy();
    });
});
