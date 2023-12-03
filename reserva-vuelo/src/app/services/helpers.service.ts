import { Injectable } from '@angular/core';
import { MD5 } from 'crypto-js';

@Injectable({
    providedIn: 'root'
})
export class HelpersService {

    constructor() { }

    /**
      * Retorna el recurso que se encuentra en la URL dada
      * @param {String} url La dirección donde se encuentra el recurso
      * @param {Object} data Un objeto con los metadatos de la petición
      * @returns Una estructura JSON con el recurso solicitado
      */
    static async fetchData(url: string, data: any  = {}): Promise<any> {
        if (!('headers' in data)) { // si no se incluyeron cabeceras…
            data.headers = { // crear un objeto con una cabecera
                'Content-Type': 'application/json; charset=utf-8'
            }
        }

        if ('body' in data) { // si hay un body con datos adicionales…
            data.body = JSON.stringify(data.body) // convertir a string
        }
        
        const response = await fetch(url, data)

        return await response.json()
    }

    /**
    * Crea una lista de elementos establecidos en options y los asocia con ulMenu
    */
    static async createList(selector: string, options: any): Promise<void> {
        let list = ''

        options.forEach((option: any) => list += `<li value="${option.value}" class="list-item hide"><a id="${option.id}" href="">${option.text}</a></li>`)
        
        if (selector) {
            const targetElement = document.querySelector(selector) as HTMLElement
            
            if (targetElement) {
                targetElement.insertAdjacentHTML('beforeend', list)    
            }else {
                console.error(`Element with selector '${selector}' not found.`);
            }
        }else {
            console.warn('Selector is null. No HTML inserted.');
        }
        
    }

    /**
    * Carga un recurso HTML en una capa de la aplicación
    * @param {String} url La ruta donde se encuentra el recurso
    * @param {String} container Opcionalmente, la capa donde se inserta el contenido
    * @returns Si el container se da, se retorna éste, si no se retorna el recurso HTML
    */
    static async loadPage(url: string, container: string | null = null): Promise<HTMLElement | string> {
        try {
            const response = await fetch(url)

            if (response.ok) {
                const html = await response.text()
                if (container) {
                    const element = document.querySelector(container) as HTMLElement
                    if (element) {
                        element.innerHTML = html
                    }
                    return element || html // este return permite encadenamiento
                } 
            } else {
                throw new Error(
                    `${response.status} - ${response.statusText}, When attempting to access the resource. '${response.url}'`
                )
            }
        } catch (e) {
            throw new Error(
                `Imposible to access the resource. '${url}`
            )
        }

        return `Imposible to access the resource. '${url}`

        // throw new Error(
        //     `Imposible to access the resource. '${url}`
        // )
    }

    /**
    * Crea el HTML correspondiente a la lista de opciones que se inyecta en un select
    * @param {Object} Object El objeto con los datos para definir la lista
    * @returns El HTML con la lista de opciones
    */
    static toOptionList = ({
        items = [], // el array de objetos para crear la lista
        value = '', // el nombre del atributo de cada objeto que se usará como value
        text = '', // el nombre del atributo de cada objeto que se usará como text
        selected = '', // el valor que debe marcarse como seleccionado
        firstOption = '' // opcionalmente una opción adicional para iniciar la lista
    } = {}) => { // ← Note cómo se desestructura el objeto en variables locales
        let options = ''
        if (firstOption) {
            options += `<option value="">${firstOption}</option>`
        }
        items.forEach(item => {
            if (item[value] == selected) { // comprobación débil adrede
                options += `<option value="${item[value]}" selected>${item[text]}</option>`
            } else {
                options += `<option value="${item[value]}">${item[text]}</option>`
            }
        })
        return options
    }

    /**
     * Para un conjunto de checkbox, devuelve un array con los marcados
     * @param {String} selector Uno que represente el conjunto de checkbox
     * @returns Un array de objetos { id: item.id, value: item.value }
     */
    static selectedBoxes = (selector: string) => {
        let items = document.querySelectorAll(`${selector}:checked`) as NodeListOf<HTMLInputElement>
        const itemsArray = Array.from(items);
        // usar rest para desestructurar en un array el nodeList y mapearlo
        return [...itemsArray].map(item => ({ id: item.id, value: item.value }))
    }

    /**
    * Devuelve los datos del elemento de lista seleccionado
    * @param {String} selector Uno que representa el select list
    * @returns Un objeto de la forma { index: …, value: …, text: … }
    */
    static selectedItemList = (selector: string) => {
        const list = document.querySelector(selector) as HTMLSelectElement
        const item = list.options[list.selectedIndex]
        return {
            index: list.selectedIndex,
            value: item.value,
            text: item.text,
        }    
    
    }

    /**
    * Aplica las reglas de validación definidas para un formulario HTML.
    * Incluso puede indicar un callback para complementar la validación.
    * @param {String} formSelector El selector para referenciar el formulario
    * @param {String} callBack Una función opcional con otras reglas de validación
    * @returns true si todas las validaciones pasan la prueba
    */
    static okForm = (formSelector: string, callBack: Function | null = null) => {
        let ok = true
        const form = document.querySelector(formSelector) as HTMLFormElement

        if (!form.checkValidity()) { // si hay datos inválidos…
            // agregar un botón al formulario y forzar un click sobre él
            const button = document.createElement('button')
            form.appendChild(button) // agrega el botón creado al formulario
            button.click()
            form.removeChild(button) // eliminar el nuevo botón después del click
            ok = false
        }

        if (typeof callBack === 'function') {
            ok = ok && callBack() // ejemplo de cómo ejecutar un callBack
        }

        return ok
    }

    /**
    * Dado un selector de un conjunto de checkboxes, marca los indicados por el
    * array subset
    * @param {*} selector El selector del conjunto de checkboxes
    * @param {*} subset Un array de objetos que contiene elementos con el atributo
    *            value, indicando éste atributo el value de las casillas que hay
    *            que seleccionar.
    */
    static checkSomeCheckboxes(selector: string, subset: { value: string }[] = []): void {
        // obtener las casillas indicadas por el selector
        const checkboxes = document.querySelectorAll(selector) as NodeListOf<HTMLInputElement>
        // desmarcar todas las casillas
        checkboxes.forEach(checkbox => (checkbox.checked = false))
        const checkboxesArray = Array.from(checkboxes);
        // filtrar los checkboxes que aparecen en el subSet
        const subsetCheckBox = [...checkboxesArray]
            .filter(checkbox => subset.some(item => item.value === checkbox.value))
        // Marcar como seleccionados sólo los filtrados
        subsetCheckBox.forEach(checkbox => (checkbox.checked = true))
    }

    /**
     * encript the string to md5
     * @param {string} password the element string given
     * @returns {string} hashedPassword the string hashed
     */
    static toMD5(password: string): string {
        const hashedPassword = MD5(password).toString();
        return hashedPassword;
    }
}
