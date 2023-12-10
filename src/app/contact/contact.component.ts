import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../abstract/component.base';

interface IContactModel {
}

@Component({
    selector: 'app-contact',
    templateUrl: './contact.component.html'
})
export class ContactComponent extends ComponentBase<IContactModel, any> {
}
