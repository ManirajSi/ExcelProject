import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactService } from 'src/app/layout/service/react.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
    providers: [MessageService],
})
export class LoginComponent {
    signupLoginText: string = 'Sign Up';
    valCheck: string[] = ['remember'];
    actionType: string = 'Login';
    password!: string;
    otpValue: string = '';
    userForm: FormGroup;
    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        private router: Router,
        private reactService: ReactService
    ) {
        this.userForm = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [
                Validators.required,
                Validators.minLength(6),
            ]),
            name: new FormControl(''),
            phoneNo: new FormControl(''),
            authCode: new FormControl(''),
            otp: new FormControl(''),
        });
    }
    signupLoginClick() {
        debugger;
        this.actionType == 'Login'
            ? (this.actionType = 'Sign Up')
            : (this.actionType = 'Login');
        this.signupLoginText == 'Sign Up'
            ? (this.signupLoginText = 'Login')
            : (this.signupLoginText = 'Sign Up');
    }
    onSubmit() {
        console.log('this.userForm===>', this.userForm);
        if (this.userForm.valid) {
            let detail = '';
            if (this.actionType == 'Login') {
                detail = 'User Login successfully';
                this.reactService.setLoginInfo({
                    isLoggedIn: true,
                });
                this.router.navigate(['/']);
            } else {
                detail = 'Successfully created your account';
                this.signupLoginClick();
            }
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: detail,
            });
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Form not valid check the fields',
            });
        }
    }
}
