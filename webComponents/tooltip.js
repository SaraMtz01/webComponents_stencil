class Tooltip extends HTMLElement { //hereda de HTMLElement
    constructor(){ //lo primero que se ejecuta al isntanciar un objeto es el constructor. No es el lugar para acceder al dOm
        super(); //evita que aparez ca un error
        this._tooltipContainer;
        this._tooltipText = 'Texto por default.'; //Se inicializa con un texto random 
        this.attachShadow({mode: 'open'}); //para acceder al shadow

        this.shadowRoot.innerHTML=`
        <slot>Some default into slot</slot> 
        <span> ( ? )</span> `;


        //--------- Primera alternativa de usar templates ----------------
        /*const template = document.querySelector('#tooltip-template');
        this.shadowRoot.appendChild(template.content.cloneNode(true)); //cloneNode() recibe valores booleanos -> True: cuando se quiere clonar dnodos hijos / False: cuando solo se desea clonar el nodo actual
        /**Estas líneas (8 y 9) toman el contenido del <template> con el ID tooltip-tamplate, lo clonan (incluyendo todo el contenido de los nodos hijos), y luego lo insertan en el Shadow DOM del componente. */

        console.log("It's working");
        /**this._tooltipContainer es una propiedad que declaras en tu clase para hacer referencia a un contenedor para el tooltip.
         * El constructor no es el mejor lugar para manipular el DOM, ya que está destinado a inicializar el objeto, no a interactuar con los elementos del DOM. Por lo tanto, es más adecuado hacer la manipulación del DOM en connectedCallback, que es cuando el componente se ha añadido realmente al DOM. */
        
    }

    connectedCallback(){
        if(this.hasAttribute('text')){
            this._tooltipText = this.getAttribute('text');
        }

        const toolTipIcon = this.shadowRoot.querySelector('span'); //a línea que contiene const toolTipIcon = this.shadowRoot.querySelector('span'); busca un <span> dentro del Shadow DOM del componente.
        
        toolTipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
        toolTipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
        this.shadowRoot.appendChild(toolTipIcon);  //this accede al objeto web component y appendChild agrega un nodo hijo

        this.style.position='relative'; 
    }

    /** --RELATIVE--
     * al aplicar position: relative a tu componente (this en este caso, que es la instancia de Tooltip), le estás diciendo al navegador que:
     * Mantenga el elemento en su lugar dentro del flujo del documento.
     * Permita que los elementos hijos dentro de este componente puedan ser posicionados de manera relativa a este contenedor (esto es importante si tienes, por ejemplo, el tooltip que quieres posicionar respecto al icono de ayuda). */

    _showTooltip (){ //Se nombra con una convenció empezando por '_', lo que indica que este método se desea usar solo dentro de esta clase
        this._toolTipContainer = document.createElement('div');
        this._toolTipContainer.textContent= this._tooltipText;

        this._toolTipContainer.style.backgroundColor = 'black';
        this._toolTipContainer.style.color = 'white';
        this._toolTipContainer.style.position = 'absolute';

        this.shadowRoot.appendChild(this._toolTipContainer);
    }

    _hideTooltip(){
        this.shadowRoot.removeChild(this._toolTipContainer);

    }
}

customElements.define('sm-component', Tooltip); //(conbre-etiqueta-HTML, clase)