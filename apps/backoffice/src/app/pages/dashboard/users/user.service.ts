import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User, CreateUserRequest, UpdateUserRequest } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly base = `${environment.apiUrl}/auth/users`;

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.base);
  }

  create(body: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.base, body);
  }

  update(id: string, body: UpdateUserRequest): Observable<User> {
    return this.http.patch<User>(`${this.base}/${id}`, body);
  }
}
