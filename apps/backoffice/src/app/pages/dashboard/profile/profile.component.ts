import { Component, inject, signal, OnInit, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth.service';

function passwordsMatch(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;
  return password && confirm && password !== confirm ? { mismatch: true } : null;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './profile.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class ProfileComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly profile = this.authService.profile;
  readonly isSavingName = signal(false);
  readonly isSavingPassword = signal(false);
  readonly nameSaved = signal(false);
  readonly errorName = signal<string | null>(null);
  readonly errorPassword = signal<string | null>(null);
  readonly errorPasswordMessage = signal<string | null>(null);

  readonly nameForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
  }, { validators: passwordsMatch });

  constructor() {
    effect(() => {
      const name = this.profile()?.name;
      if (name) this.nameForm.patchValue({ name });
    });
  }

  ngOnInit(): void {}

  saveName(): void {
    if (this.nameForm.invalid || this.isSavingName()) return;
    this.isSavingName.set(true);
    this.errorName.set(null);
    this.nameSaved.set(false);

    this.authService.updateProfile({ name: this.nameForm.getRawValue().name }).subscribe({
      next: () => {
        this.isSavingName.set(false);
        this.nameSaved.set(true);
        setTimeout(() => this.nameSaved.set(false), 3000);
      },
      error: () => {
        this.errorName.set('No se pudo actualizar el nombre.');
        this.isSavingName.set(false);
      },
    });
  }

  savePassword(): void {
    if (this.passwordForm.invalid || this.isSavingPassword()) return;
    this.isSavingPassword.set(true);
    this.errorPasswordMessage.set(null);

    this.authService.updateProfile({ password: this.passwordForm.getRawValue().password }).subscribe({
      next: () => {
        this.isSavingPassword.set(false);
        this.passwordForm.reset();
      },
      error: () => {
        this.errorPasswordMessage.set('No se pudo actualizar la contraseña.');
        this.isSavingPassword.set(false);
      },
    });
  }
}
