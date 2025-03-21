class Modal extends HTMLElement{
constructor(){
    super();
    this.attachShadow({mode: 'open'});
    this.isOpen= false;
    this.shadowRoot.innerHTML=`
    <!-- interior de sm-modal -->
     <style>
        #backdrop{
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.75);
            z-index: 10;
            opacity: 0;
            pointer-events: none;
        }
        
        #modal{
            position: fixed;
            top: 15vh;
            left: 25%;
            
            width: 50%;
            z-index: 100;
            background: white;
            border-radius: 3px;
            box-shadow: 0 2px 8px rgba(0,0, 0, 0.26);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 0;
            pointer-events: none;
        } 
        
        /*
        Cuando el componente <sm-modal> tiene el atributo opened:
        - El fondo del modal (#backdrop) y el modal mismo (#modal) se vuelven visibles con opacity: 1 (ya no son transparentes).
        - Los elementos #backdrop y #modal pueden interactuar con eventos de puntero como clics (pointer-events: all), lo que permite que el usuario interactúe con el modal.*/
        
        :host([opened]) #backdrop, 
        :host([opened]) #modal{
            opacity: 1;
            pointer-events: all;
        }

         #main{
            padding: 1rem; 
        }
        
        #actions{
            border-top: 1px solid #ccc;
            padding: 1rem;
            display: flex;
            justify-content:  flex-end;
        }
            
        #actions button{
            margin: 0 0.25rem;
        }

         header{
            padding: 1rem;
        }

        ::slotted(h1){
            font-size: 1.25rem;
        }

     </style>
     <div id="backdrop"></div>
     <div id="modal">
        <header>
            <slot name="title">Please confirm payment</slot>
        </header>
        <section id="main">
            <slot></slot>
        </section>
        <section id="actions">
            <button id= "cancel-btn">Cancel</button>
            <button id="confirm-btn">Confirm</button>
        </section>
     </div>`;

     const slots = this.shadowRoot.querySelectorAll('slot'); // La línea de código obtiene todos los elementos <slot> dentro del Shadow DOM del componente y los guarda en la variable slots
     slots[1].addEventListener('slotchange', event =>{
        console.dir(slots[1].assignedNodes());
     });
     const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
     const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
     const backdrop = this.shadowRoot.querySelector('#backdrop');

     cancelButton.addEventListener('click', this._cancel.bind(this));
     confirmButton.addEventListener('click', this._confirm.bind(this));
     backdrop.addEventListener('click', this._clickBackdrop.bind(this));

    /*  cancelButton.addEventListener('cancel', ()=>{
        console.log("Cancel inside the component");
     }); */
}


//Esta es una forma de hacerlo
attributeChangedCallback(name, oldValue, newValue){
    //if(name== 'opened'){
        if(this.hasAttribute('opened')){
            this.isOpen = true;
        /*
            this.shadowRoot.querySelector('#backdrop').style.opacity = 1;
            this.shadowRoot.querySelector('#backdrop').style.pointerEvents = 'all';
            this.shadowRoot.querySelector('#modal').style.opacity = 1;
            this.shadowRoot.querySelector('#modal').style.pointerEvents = 'all';*/
        }else{
            this.isOpen = false;
        }
    }   



static get observedAttributes(){
    return['opened'];
}

open(){
    this.setAttribute('opened', '');
    this.isOpen=true;
}

hide(){
    if(this.hasAttribute('opened')){
        this.removeAttribute('opened');
    }
    this.isOpen =false;
}

//Esta es a primera forma de hacer que se detone algo en consola al dar click en un botón
_cancel(event){
    this.hide();
    const cancelEvent = new Event('cancel', {bubbles:true, composed: this.toggleAttribute});
    event.target.dispatchEvent(cancelEvent);
}

//Esta es a primera forma de hacer que se detone algo en consola al dar click en un botón
_confirm(){
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
}

_clickBackdrop(){
    this.hide();
    const clickBackdropEvent = new Event('backdropClick');
    this.dispatchEvent(clickBackdropEvent);
}
}

customElements.define('sm-modal', Modal);