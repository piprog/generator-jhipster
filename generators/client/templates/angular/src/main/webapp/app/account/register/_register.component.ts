import { Component, OnInit, Renderer, ElementRef } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { Register } from './register.service';
import { LoginModalService<% if (enableTranslation) { %>, JhiLanguageService<% }%> } from '../../shared';

@Component({
    selector: '<%=jhiPrefix%>-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {

    confirmPassword: string;
    doNotMatch: string;
    error: string;
    errorEmailExists: string;
    errorUserExists: string;
    registerAccount: any;
    success: boolean;
    modalRef: NgbModalRef;

    constructor(
        <%_ if (enableTranslation) { _%>
        private languageService: JhiLanguageService,
        <%_ } _%>
        private loginModalService: LoginModalService,
        private registerService: Register,
        private elementRef: ElementRef,
        private renderer: Renderer) {
    }

    ngOnInit() {
        this.success = false;
        this.registerAccount = {};
    }

    ngAfterViewInit() {
        this.renderer.invokeElementMethod(this.elementRef.nativeElement.querySelector('#login'), 'focus', []);
    }

    register() {
        if (this.registerAccount.password !== this.confirmPassword) {
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.error = null;
            this.errorUserExists = null;
            this.errorEmailExists = null;
<%_ if (enableTranslation) { _%>
            this.languageService.getCurrent().then(key => {
                this.registerAccount.langKey = key;
                this.registerService.save(this.registerAccount).subscribe(() => {
                    this.success = true;
                }, this.processError);
            });
<%_ } else { _%>
            this.registerAccount.langKey = 'en';
            this.registerService.save(this.registerAccount).subscribe(() => {
                this.success = true;
            }, this.processError);
<%_ } _%>
        }
    }

    openLogin() {
        this.modalRef = this.loginModalService.open();
    }

    private processError(response) {
        // TODO handle this.logout(); on error
        this.success = null;
        if (response.status === 400 && response.data === 'login already in use') {
            this.errorUserExists = 'ERROR';
        } else if (response.status === 400 && response.data === 'e-mail address already in use') {
            this.errorEmailExists = 'ERROR';
        } else {
            this.error = 'ERROR';
        }
    }
}
