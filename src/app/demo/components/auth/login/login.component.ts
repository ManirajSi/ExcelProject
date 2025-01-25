import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactService } from 'src/app/layout/service/react.service';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/services/email.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Observable } from 'rxjs/internal/Observable';
import { DefaultGlobalValues } from 'src/app/Defaults/defaultValues';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    providers: [MessageService],
})
export class LoginComponent {
    signupLoginText: string = 'Sign Up';
    valCheck: string[] = ['remember'];
    actionType: string = 'Login';
    password!: string;
    otpValue: string = '';
    userForm: FormGroup;
    generatedOtp: string = '';
    authCodeList: string[] = ['SISY-PERS-0001', 'SISY-PERS-0002'];
    users: any;
    defaultGlobalValues = DefaultGlobalValues;
    constructor(
        public layoutService: LayoutService,
        private messageService: MessageService,
        private router: Router,
        private reactService: ReactService,
        private http: HttpClient,
        private emailService: EmailService,
        private firestoreService: FirestoreService
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
    ngOnInit() {
        this.onFormValueChange();
        this.firestoreService.getData('users').subscribe((data) => {
            this.users = data;
            console.log('this.users==>', this.users);
        });
    }
    onFormValueChange() {
        this.userForm.valueChanges.subscribe((value) => {});
    }
    signupLoginClick() {
        this.actionType == 'Login'
            ? (this.actionType = 'Sign Up')
            : (this.actionType = 'Login');
        this.signupLoginText == 'Sign Up'
            ? (this.signupLoginText = 'Login')
            : (this.signupLoginText = 'Sign Up');
    }
    validateAuthCode() {
        let currCode = this.userForm.get('authCode')?.value;
        if (this.authCodeList.some((code) => code.includes(currCode))) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Code Matched',
            });
            this.sendEmail();
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Code Not Matched',
            });
        }
    }
    onSubmit() {
        if (this.userForm.valid) {
            if (this.actionType == 'Login') {
                this.getDataById(
                    this.userForm.get('email')?.value,
                    this.userForm.get('password')?.value
                );
            } else {
                this.createAccout();
            }
        } else {
            this.showToast(2, 'Form not valid check the fields');
        }
    }
    createAccout() {
        if (this.generatedOtp === this.userForm.get('otp')?.value) {
            this.addData();
        } else {
            this.showToast(2, 'OTP you entered is not valid');
        }
    }
    emailValidation() {
        let isValidEmail: boolean = false;
        let email: string = this.userForm.get('email')?.value;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email) {
            isValidEmail = false; // No error if the field is empty (required validator will handle this)
        }
        isValidEmail = emailRegex.test(email) ? true : false;
        if (!isValidEmail) {
            this.showToast(2, 'Please enter valid email address');
        }
    }
    generateOtp() {
        this.generatedOtp = Math.floor(
            100000 + Math.random() * 900000
        ).toString(); // Generate a 6-digit OTP
        this.sendEmail();
    }
    sendEmail() {
        const username =
            this.userForm.get('name')?.value == ''
                ? 'User'
                : this.userForm.get('name')?.value;
        const emailAddress = this.userForm.get('email')?.value;
        if (emailAddress) {
            const mailbody = `

            Your One-Time Password (OTP) for verification is: ${this.generatedOtp}

            Please use this OTP to complete your verification process. This code is valid for the next 10 minutes.

            If you did not request this, please ignore this email.

            Thank you,
            Admin | Excelendsite.web.app

            Note: Do not share this OTP with anyone for your account's security. `;

            const formData = {
                user_name: username,
                user_email: emailAddress,
                from_name: 'Excelendsite.web.app',
                subject: 'Your One-Time Password (OTP) for Verification',
                reply_to: 'primeindia360@gmail.com',
                message: mailbody,
            };
            this.emailService
                .sendEmail(formData)
                .then((response) => {
                    this.showToast(
                        1,
                        'OTP Email sent successfully to this Email ' +
                            emailAddress
                    );
                })
                .catch((error) => {
                    this.showToast(2, 'Failed to send OTP email!');
                });
        } else {
            this.showToast(2, 'Please enter Email Address');
        }
    }
    addData() {
        const data = {
            email: this.userForm.get('email')?.value,
            password: this.userForm.get('password')?.value,
            userName: this.userForm.get('name')?.value,
            phoneNumber: this.userForm.get('phoneNo')?.value,
            otp: this.userForm.get('otp')?.value,
            authCode: this.userForm.get('authCode')?.value,
        };
        console.log('data===>', data);
        this.firestoreService.setData('users', data.email, data).then(() => {
            this.showToast(1, 'Successfully created your account');
            this.signupLoginClick();
        });
    }
    backToPage() {
        this.router.navigate(['/']);
    }
    showToast(type: number, message: string) {
        switch (type) {
            case 1:
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: message,
                });
                break;
            case 2:
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: message,
                });
                break;
        }
    }
    getDataById(email: string, password: string) {
        let getEmailInfo = this.firestoreService.getDataById('users', email);
        getEmailInfo.subscribe((value) => {
            if (
                this.userForm.get('email').value == value.email &&
                this.userForm.get('password').value == value.password
            ) {
                sessionStorage.setItem('email', value.email);
                sessionStorage.setItem('userName', value.userName);
                this.defaultGlobalValues.loginUserName = value.email;
                this.showToast(1, 'User Login successfully');
                this.reactService.setLoginInfo({
                    isLoggedIn: true,
                });
                this.router.navigate(['/']);
            } else {
                this.showToast(2, 'Login detail not matched');
            }
        });
    }
}
