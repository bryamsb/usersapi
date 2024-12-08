import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Usuarios - API';
  users: any[] = [];

  newUser = {
    email: '',
    name: '',
    password: '',
    role: '',
    avatar: '',
  };
  editingUserId: number | null = null;  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getUsers(); 
  }

  
  getUsers(): void {
    const apiUrl = 'https://api.escuelajs.co/api/v1/users';

    this.http.get<any[]>(apiUrl).subscribe(
      (data) => {
        console.log('Usuarios obtenidos:', data);
        this.users = data;
      },
      (error) => {
        console.error('Error al obtener usuarios:', error);
      }
    );
  }

  
  addUser(): void {
    const apiUrl = 'https://api.escuelajs.co/api/v1/users';
    let request$;

    if (this.editingUserId === null) {
      
      request$ = this.http.post<any>(apiUrl, this.newUser);
    } else {
      
      request$ = this.http.put<any>(`${apiUrl}/${this.editingUserId}`, this.newUser);
    }

    request$.subscribe(
      (data) => {
        if (this.editingUserId === null) {
          console.log('Usuario agregado:', data);
          this.users.push(data);
        } else {
          console.log('Usuario actualizado:', data);
          const index = this.users.findIndex(user => user.id === this.editingUserId);
          if (index !== -1) {
            this.users[index] = data;  
          }
        }
        this.resetNewUser(); 
        this.editingUserId = null; 
      },
      (error) => {
        console.error('Error al agregar o actualizar usuario:', error);
      }
    );
  }

  
  deleteUser(userId: number): void {
    const apiUrl = `https://api.escuelajs.co/api/v1/users/${userId}`;

    this.http.delete(apiUrl).subscribe(
      (response) => {
        console.log('Usuario eliminado:', response);
        
        this.users = this.users.filter(user => user.id !== userId);
      },
      (error) => {
        console.error('Error al eliminar usuario:', error);
      }
    );
  }


  editUser(userId: number): void {
    const user = this.users.find(user => user.id === userId);
    if (user) {
      this.newUser = { ...user };  
      this.editingUserId = userId;  
    }
  }

  
  private resetNewUser(): void {
    this.newUser = {
      email: '',
      name: '',
      password: '',
      role: '',
      avatar: '',
    };
  }
}
