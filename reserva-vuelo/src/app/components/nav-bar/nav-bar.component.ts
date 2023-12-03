import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpersService as Helpers } from '../../services/helpers.service';
import { Router } from '@angular/router';

@Component({
  selector: 'nav-bar-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent {
  static options: any;

  constructor(protected router: Router) {
    NavBarComponent.main(router)
  }

  /**
    * Carga los metodos de la clase App
    */
  static async main(router: Router): Promise<void> {
    NavBarComponent.options = await Helpers.fetchData('assets/menu.json')
    await Helpers.createList('nav > ul', NavBarComponent.options)
    
    NavBarComponent.toggleMenu()
    NavBarComponent.activateMenu(router)

    const home = document.querySelector('.home') as HTMLElement
    
    home.addEventListener('click', () => { // registrar un gestor de eventos
      router.navigate(['']);
    })

  }

  /**
  * Da funcionalidad al boton de menu
  */
  static toggleMenu(): void {
    const menuIcon = document.querySelectorAll('nav ul li')[0];
    const listItems = document.querySelectorAll('nav ul li[class^="list-item hide"]');

    menuIcon.addEventListener("click", () => {
      listItems.forEach((listElement) => {
        listElement.classList.toggle('hide') // toggle alterna y quita la clase o la coloca segun la encuentra o no
      })
    })

  }

  /**
  * Genera un addEvenListener tipo click a cada uno de los elementos de la lista
  */
  static activateMenu(router: Router): void {
    const links = document.querySelectorAll('nav ul li[class^="list-item"] a') as NodeListOf<HTMLElement>
    links.forEach(item => {
      item.addEventListener("click", (e: MouseEvent) => {
        e.preventDefault()
        this.menuOptions(e, router)
      })
    })

  }

  /**
  * Carga un recurso HTML en una capa de la aplicación
  * @param {Object} e objeto del evento
  */
  static menuOptions = async (e: MouseEvent, router: Router): Promise<void> => {
    e.preventDefault()
    const option = (e.target as HTMLElement).id.trim()
    let response = null;
    let html = null
    console.log(option);
    switch (option) {
      case 'reservas':
        break
      case 'vuelos':
        break
      case 'usuario':
        router.navigate(['/usuarios']);
        break
      case 'acerca':
        break
      case 'ofertas':
        break

    }

    if (typeof response == "string") {
      const main = document.querySelector('main') as HTMLElement
      main.innerHTML = response
    }

  }
  
}
