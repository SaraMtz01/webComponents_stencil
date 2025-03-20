class Tooltip extends HTMLElement { //hereda de HTMLElement
    constructor() { //lo primero que se ejecuta al isntanciar un objeto es el constructor. No es el lugar para acceder al dOm
        super(); //evita que aparez ca un error
        //this._tooltipContainer; //El guión bajo al inicio es para indicar que se trata de una propiedad "Private"
        this.toolTipIcon;
        this._tooltipVisible = false;
        this._tooltipText = 'Texto por default.'; //Se inicializa con un texto random 
        this.attachShadow({ mode: 'open' }); //para acceder al shadow

        this.shadowRoot.innerHTML = `

        <style>
            div{
                font-weight:normal;
                background-color: black;
                color: white;
                top:1.5rem;
                left: 0.75rem;
                position: absolute;
                z-index:1 0;
                padding: 0.15rem;
                border-radius: 3px;
                box-shadow: 1px 1px 6px rgba(0,0,0.26)
            }

             /*Esto no se aplica, porque el elemento al que se aplica el estilo no es parte del shadow DOM */
            .subrayar{ 
            background-color: rgb(254, 12, 12);
            }

            /*Para dar estilo a un elemento dentro del slot
             - Dentro del parentesis se puede introducir una clase, un Id, o una etiqueta (span, a, p, etc) 
             -Solo se puede hacer referencia a un solo elemento */
            
            /* no dejar espacio entre slotted y (), porque no aplica el estilo
            Sí puede afectar a elementos dentro del ligth DOMsiempre y cuando use slotted*/
            ::slotted(.subrayar) { 
            border-bottom: 3px dotted blue;
            } 
            

            .icon{
                background: black;
                color: white;
                padding: 0.1rem 0.25rem;
                text-aling: center;
                border-radius: 50%;
            }

            /*:host{
            background: gray; host hace referencia al webcomponent creado sm-component. Se usa para agregar estilos al Webcomponent desde dentro de él
            }*/

            :host{
                position: relative;   
            }

            /*Se aplica solo al elemento dentro del host cuya clase es "itsImportant
            Desde aquí se puede usar una varibale CSS, después de ña coma se puede agregar un estilo por default*/
            :host(.itsImportant){
                background-color: var(--color-primary, #ccc);
                padding: 0.15rem;
            } 

            /*Se aplica en el web component contenido dentro de una etiqueta P
             p.clas se puede añadir también dentro del parentesis*/
            :host-context(p){ 
            font-weight: bold;
            }
        </style>

        <slot>Some default into slot</slot> 
        <span class="icon"> ? </span> `;


        //--------- Primera alternativa de usar templates ----------------
        /*const template = document.querySelector('#tooltip-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true)); //cloneNode() recibe valores booleanos -> True: cuando se quiere clonar dnodos hijos / False: cuando solo se desea clonar el nodo actual
        /**Estas líneas (8 y 9) toman el contenido del <template> con el ID tooltip-tamplate, lo clonan (incluyendo todo el contenido de los nodos hijos), y luego lo insertan en el Shadow DOM del componente. */

        console.log("It's working");
        /**this._tooltipContainer es una propiedad que declaras en tu clase para hacer referencia a un contenedor para el tooltip.
         * El constructor no es el mejor lugar para manipular el DOM, ya que está destinado a inicializar el objeto, no a interactuar con los elementos del DOM. Por lo tanto, es más adecuado hacer la manipulación del DOM en connectedCallback, que es cuando el componente se ha añadido realmente al DOM. */

    }

    connectedCallback() {
        if (this.hasAttribute('text')) {
            this._tooltipText = this.getAttribute('text');
        }

        this._toolTipIcon = this.shadowRoot.querySelector('span'); //a línea que contiene const toolTipIcon = this.shadowRoot.querySelector('span'); busca un <span> dentro del Shadow DOM del componente.

        this._toolTipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        this._toolTipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        //this.shadowRoot.appendChild(toolTipIcon);  //this accede al objeto web component y appendChild agrega un nodo hijo

        //this.style.position = 'relative';
        this._render();
    }

    /* Este método recibe 3 parametros: (nameOfElement, oldValue, newValue) 
    
    ste método es un callback que se ejecuta cuando uno de los atributos observados de un elemento personalizado cambia. En este caso, se ejecuta cada vez que el valor del atributo observado, en este caso text, cam*/
    attributeChangedCallback(nameOfAttribute, oldValue, newValue) {
        // Si el valor antiguo y el valor nuevo son iguales, no hace nada y simplemente retorna. Esto es una forma de optimización, evitando hacer acciones innecesarias si el valor no cambia.
        if (oldValue === newValue){
            return;
        }

        //Si el atributo que cambió es 'text', el valor nuevo de ese atributo (newValue) se asigna a la propiedad interna _tooltipText
        if(nameOfAttribute==='text'){
            this._tooltipText =newValue;
        }

    }

    /*Este es un getter estático que define qué atributos del elemento personalizado se deben observar para detectar cambios.
    En este caso, se está observando el atributo text. Esto significa que si el atributo text cambia, el método attributeChangedCallback se invocará.*/
    static get observedAttributes() {
        return ['text'];

    }

    //Se ejecuta cuando un elemento es removido del DOM
    /*DisconnectedCallback te da oportunidad para realizar tareas de limpieza o de liberación de recursos, como:

    A) Eliminar listeners de eventos: Si agregaste algún evento con addEventListener dentro del componente, es una buena práctica eliminar esos eventos cuando el componente ya no está en el DOM para evitar posibles fugas de memoria.

    b) Detener temporizadores: Si el componente tiene temporizadores (por ejemplo, usando setInterval o setTimeout), puedes limpiarlos en este método para evitar que sigan ejecutándose cuando el componente ya no está presente.

    C) Liberar recursos externos: Si tu componente interactúa con recursos externos, como conexiones de red, WebSockets, o anima elementos en un requestAnimationFrame, puedes cerrarlos o limpiarlos aquí.*/
    disconnectedCallback(){
        console.log("Disconnected");
        
        this._toolTipContainer.removeEventListener('mouseenter', this._showTooltip);
        this._toolTipContainer.removeEventListener('mouseenter', this._hideTooltip);
    }

    //Este método será responsable de actualizar eñl DOM
    /*Este método es responsable de renderizar o actualizar la visibilidad del tooltip (el cuadro de texto emergente).
        * Si this._tooltipVisible es true (lo que indica que el tooltip debe mostrarse), crea un div que actúa como el contenedor del tooltip, asigna el texto (this._tooltipText) a este contenedor y lo agrega al shadowRoot del componente (el DOM encapsulado).
        * Si this._tooltipVisible es false (lo que indica que el tooltip debe ocultarse), elimina el contenedor del tooltip del shadowRoot.*/
    _render(){
        let tooltipContainer = this.shadowRoot.querySelector('div');
        if(this._tooltipVisible){
            tooltipContainer = document.createElement('div');
            tooltipContainer.textContent = this._tooltipText;
            this.shadowRoot.appendChild(tooltipContainer);
        } else {
            if(tooltipContainer){
            this.shadowRoot.removeChild(tooltipContainer);
            }
        }

    }

    /** --RELATIVE--
     * al aplicar position: relative a tu componente (this en este caso, que es la instancia de Tooltip), le estás diciendo al navegador que:
     * Mantenga el elemento en su lugar dentro del flujo del documento.
     * Permita que los elementos hijos dentro de este componente puedan ser posicionados de manera relativa a este contenedor (esto es importante si tienes, por ejemplo, el tooltip que quieres posicionar respecto al icono de ayuda). */

    _showTooltip() { //Se nombra con una convenció empezando por '_', lo que indica que este método se desea usar solo dentro de esta clase
        //this._toolTipContainer = document.createElement('div'); //Esto se pasó al método render
        //this._toolTipContainer.textContent = this._tooltipText;

        /* Se usó antes de usar innerHTML en el constructor (usable al crear templates desde light DOM) 
         this._toolTipContainer.style.backgroundColor = 'black';
         this._toolTipContainer.style.color = 'white';
         this._toolTipContainer.style.position = 'absolute'; */

       // this.shadowRoot.appendChild(this._toolTipContainer);


       this._tooltipVisible = true;
       this._render();
    }

    _hideTooltip() {
        //this.shadowRoot.removeChild(this._toolTipContainer);
        this._tooltipVisible= false;
        this._render();
    }
}

customElements.define('sm-component', Tooltip); //(conbre-etiqueta-HTML, clase)