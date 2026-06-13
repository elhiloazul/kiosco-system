import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { AdminProfile } from '../../../../core/auth/auth.model';
import { User } from '../user.model';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-list.component.html',
  host: { class: 'flex-1 flex flex-col overflow-hidden' },
})
export class UserListComponent implements OnInit, OnDestroy {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  readonly isPrincipal = computed(() => (this.authService.profile() as AdminProfile | null)?.isPrincipal === true);
  private sub?: Subscription;

  readonly users = signal<User[]>([]);
  readonly isLoading = signal(true);
  readonly togglingId = signal<string | null>(null);
  readonly showCreateModal = signal(false);
  readonly isCreating = signal(false);
  readonly createError = signal<string | null>(null);
  private readonly nameValue = signal('');

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  readonly suggestedPassword = computed(() => {
    const name = this.nameValue().trim().toLowerCase().replace(/\s+/g, '.');
    return name ? `${name}.2025` : '';
  });

  ngOnInit(): void {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users.set(users);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    this.sub = this.form.controls.name.valueChanges.subscribe((v) =>
      this.nameValue.set(v ?? '')
    );
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  openCreateModal(): void {
    this.form.reset();
    this.createError.set(null);
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
  }

  useSuggestedPassword(): void {
    this.form.controls.password.setValue(this.suggestedPassword());
  }

  onSubmit(): void {
    if (this.form.invalid || this.isCreating()) return;
    this.isCreating.set(true);
    this.createError.set(null);

    const { name, email, password } = this.form.getRawValue();
    this.userService.create({ name, email, password }).subscribe({
      next: (user) => {
        this.users.update((list) => [...list, user]);
        this.isCreating.set(false);
        this.closeCreateModal();
      },
      error: (err) => {
        this.createError.set(
          err?.error?.message ?? 'No se pudo crear el usuario. Intenta de nuevo.'
        );
        this.isCreating.set(false);
      },
    });
  }

  toggleStatus(user: User): void {
    if (this.togglingId()) return;
    this.togglingId.set(user.id);
    const newStatus = user.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
    this.userService.update(user.id, { status: newStatus }).subscribe({
      next: (updated) => {
        this.users.update((list) => list.map((u) => (u.id === updated.id ? updated : u)));
        this.togglingId.set(null);
      },
      error: () => this.togglingId.set(null),
    });
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
}
