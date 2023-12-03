import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpersService as Helpers } from '../../services/helpers.service';
import { Usuario } from '../../interces/usuario';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'usuario-component',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {

  usuarios: Usuario[] = [];
  usuariosFiltered: Usuario[] = [];
  perfils: any[] = [];
  usuario: Usuario = {apellidos: '', password: '', identificacion: '', nombres: '', perfil: ''}
  isAdd: boolean = true;
  startIndex: number = 0;
  itemsPerPage: number = 5;
  searchTerm: string = '';

  constructor() {
    this.usuariosFromAPIToThisUsuarios()

    this.getPerfilsJSON()
      .then(data => {
        this.perfils = data;
      })
      .catch(error => {
        console.log("Error while fetching data from perfil.json");
      })
  }

  usuariosFromAPIToThisUsuarios(): void {
    this.getUsuarios()
      .then(data => {
        this.usuarios = data.data
        this.usuariosFiltered = data.data
      })
      .catch(error => {
        console.log("Error while fetching data from usuarios");
      })
  }

  async getUsuarios(): Promise<any> {
    return await Helpers.fetchData('http://localhost:4567/usuarios')
  }

  async getPerfilsJSON(): Promise<any> {
    return await Helpers.fetchData('assets/perfil.json')
  }

  async addButtonClick(): Promise<void> {
    const password = this.passwordToMD5(this.usuario.password)
    const usuarioCopy: Usuario = { ...this.usuario };
    usuarioCopy.password = password

    this.addUsuario(usuarioCopy)
    .then(data => {
      console.log(data.message);  
      this.usuariosFromAPIToThisUsuarios()
    })
    .catch(error => {
      console.log('Error while adding usuario', error);
    })
  }

  async addUsuario(user: any): Promise<any> {
    const usuario = {
      method: 'POST',
      body: user,
    }
    return await Helpers.fetchData('http://localhost:4567/usuarios', usuario)
  }  

  passwordToMD5(password: string): string {
    const hashedPassword = Helpers.toMD5(password)
    return hashedPassword
  }

  deleteButtonClick(identificacion: string): void {
    this.deleteUsuario(identificacion)
    .then(data => {
      console.log(data.message);  
      this.usuariosFromAPIToThisUsuarios()
    })
    .catch(error => {
      console.log('Error while deleting usuario', error);
    })
  }

  async deleteUsuario(identificacion: string): Promise<any> {
    const usuario = {
      method: 'DELETE',
      body: {},
    }
    return await Helpers.fetchData(`http://localhost:4567/usuarios/${identificacion}`, usuario)
  }  

  async getUsuario(identificacion: string): Promise<any> {
    const usuario = {
      method: 'GET',
    }
    return await Helpers.fetchData(`http://localhost:4567/usuarios/${identificacion}`, usuario)    
  }  

  editButtonClick(usuario: Usuario): void {
    this.usuario = usuario;
    this.usuario.password = '';
    this.isAdd = false;
  }

  async updateButtonClick(): Promise<void> {
    const password = this.passwordToMD5(this.usuario.password)
    let usuarioCopy: any = { ...this.usuario };
    const identificacion: string = this.usuario.identificacion
    usuarioCopy.password = password
    delete usuarioCopy.identificacion;

    this.updateUsuario(usuarioCopy, identificacion)
    .then(data => {
      console.log(data.message);  
      this.usuariosFromAPIToThisUsuarios()
    })
    .catch(error => {
      console.log('Error while updating usuario', error);      
    })
  }

  async updateUsuario(user: any, identificacion: string): Promise<any> {
    const usuario = {
      method: 'PUT',
      body: user,
    }
    return await Helpers.fetchData(`http://localhost:4567/usuarios/${identificacion}`, usuario)
  }  

  previousPage(): void {
    this.startIndex = this.startIndex - this.itemsPerPage;
  }

  nextPage(): void {
    this.startIndex = this.startIndex + this.itemsPerPage;
  }

  filterTable(): void {
    this.usuariosFiltered = this.usuarios.filter(usuario => 
      usuario.nombres.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.apellidos.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      usuario.perfil.toLowerCase().includes(this.searchTerm.toLowerCase()) 
    )
  }
}
