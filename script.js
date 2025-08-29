// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// seleziona provider
function provselect() {
  var l;
  l = document.getElementById("b_provselect");
  provider = l.options[l.selectedIndex].innerHTML;
//  alert(provider);
  pagina = 100;
  subpagina = 1;
  setpage();
}

// -----------------------------------------------------------------------
// set/unset favourite
function favset() {
  var t;

  // verifica se l'elemento di array è uguale a pagina
  function chkfav(p) {
    return p == pagina;
  }

  // controlla, se la pagina esiste già allora cancellala
  t = preferiti.findIndex(chkfav);

  // se non trova nulla ritorna -1
  // altrimenti ritorna l'indice del record da cancellare
  if (t >= 0) {
    // utilizza il metodo splice, dove il primo argomento è l'indice da cancellare
    // e il secondo il numero di elementi da cancellare
    preferiti.splice(t, 1);
    alert("Preferito cancellato (" + pagina + ")");
  } else {
    // aggiungi pagina all'array fav
    preferiti.push(pagina);
    alert("Preferito aggiunto (" + pagina + ")");
  }

  // riordina la lista
  preferiti.sort();
  // aggiorna elemento select
  updateselect(preferiti, "b_favselect");
}

// -----------------------------------------------------------------------
// seleziona favourite
function favselect() {
  var l;
  l = document.getElementById("b_favselect");
  pagina = l.options[l.selectedIndex].innerHTML;
  setpage();
}

//------------------------------------------------------
// Aggiorna gli elenchi del widget select, utilizzando la lista p_l
function updateselect(p_l, p_sid) {
  "use strict";
  var sel, lst, i, sl, o;

  // lista
  lst = p_l;
  // widget select (viene passato l'id)
  sel = document.getElementById(p_sid);

  // azzera il select, cominciando dal fondo
  // perché altrimenti non funziona, perchè l'indice
  // cambia sempre, poiché le option calano
  sl = sel.length;
  for (i = sl - 1; i >= 0; i -= 1) {
    sel.remove(i);
  }

  // carica dal file p_l
  sl = lst.length;
  for (i = 0; i < sl; i += 1) {
    o = document.createElement("option");
    o.text = lst[i];
    sel.add(o);
  }

  // deselect select, per consentire la scelta anche della prima opzione
  sel.selectedIndex = "-1";
}

// -----------------------------------------------------------------------
// page loading error
function pageerror(event) {
  //  alert(event);
  if (movimento == "pageup") {
    calcpage("pageup");
  }
  if (movimento == "pagedown") {
    calcpage("pagedown");
  }
  if (movimento == "subup") {
    subpagina = 1;
    setpage();
  }
}

// -----------------------------------------------------------------------
// mouse scrolling up/down
function scrollinput() {
  var y = event.deltaY;
  var d;

  // scroll up
  if (y < 0) {
    // page scroll
    if (document.getElementById("pagescroll").checked) {
      calcpage("pageup");
      // fav scroll
    } else {
      calcpage("favup");
    }
    // scroll dowb
  } else {
    // page down
    if (document.getElementById("pagescroll").checked) {
      calcpage("pagedown");
      // fav down
    } else {
      calcpage("favdown");
    }
  }
}

// -----------------------------------------------------------------------
// seleziona direttamente il numero di pagina
function pageinput() {
  pagina = document.getElementById("b_pagina").value;
  subpagina = 0;
  //  alert(pagina);
  setpage();
}

// -----------------------------------------------------------------------
// calcola il nuovo numero di pagina/subpagina
function calcpage(t_p) {
  var t_src;
  // memorizza il comando di movimento pagina

  movimento = t_p;
  switch (t_p) {
    case "pageup":
      pagina++;
      subpagina = 1;
      break;
    case "pagedown":
      pagina--;
      if (pagina < 100) {
        pagina = 100;
      }
      subpagina = 1;
      break;
    case "subup":
      subpagina++;
      if (subpagina == 1) {
        subpagina = 2;
      }
      break;
    case "subdown":
      subpagina--;
      if (subpagina < 0) {
        subpagina = 0;
      }
      if (subpagina == 1) {
        subpagina = 0;
      }
      break;
    case "home":
      pagina = 100;
      subpagina = 1;
      break;
    case "favup":
      var maxfav = preferiti.length - 1;
      i_fav++;
      if (i_fav > maxfav) {
        i_fav = 0;
      }
      pagina = preferiti[i_fav];
      subpagina = 1;
      break;
    case "favdown":
      var maxfav = preferiti.length - 1;
      i_fav--;
      if (i_fav < 0) {
        i_fav = maxfav;
      }
      pagina = preferiti[i_fav];
      subpagina = 1;
      break;
  }
  setpage();
}

// -----------------------------------------------------------------------
// crea l'url, utilizzando le variabili globali pagina e subpagina, e lo inserisce nell'iframe
function setpage() {
  var t_src, t_pagina, t_subpagina;

  //  alert(pagina);
  //  alert(subpagina);

  // Inserisce l'immagina della pagina
  switch (provider) {
    case "rai":
      t_pagina = pagina;
      if (subpagina > 1) {
        t_pagina = pagina + "." + subpagina;
      }
      t_src =
        "https://www.servizitelevideo.rai.it/televideo/pub/tt4web/Nazionale/16_9_page-" +
        t_pagina +
        ".png";
      break;
    case "antena 3":
      t_src = "https://www.antena3.com/teletexto/100/" + pagina + "_0001.png";
      break;
    case "rtbf":
      t_src = "https://ds.static.rtbf.be/teletext/La1/100/" + pagina + "_0001.png";
      break;       
    case "la sexta":
      t_src = "https://www.lasexta.com/teletexto/datos/100/" + pagina + "_0001.png";
      break;       
    case "rtp":
      // todo cambia anche la dir precedente
      t_src = "https://www.rtp.pt/wportal/fab-txt/100/" + pagina + "_0001.png";
      break;       
    case "orf":
      // todo cambia anche la dir precedente
      t_src = "https://appfeeds.orf.at/teletext/images/orf1/" + pagina + "_0001.png";
      break;
    case "srf1":
      // todo cambia anche la dir precedente
      t_src = "http://api.teletext.ch/online/pics/medium/SRF1_" + pagina + "-0.gif";
      break;     
          case "rsi1":
      // todo cambia anche la dir precedente
      t_src = "http://api.teletext.ch/online/pics/medium/RSILA1_" + pagina + "-0.gif";
      break;   
  }

  // Inserisce l'immagina della pagina
  document.getElementById("teletextFrame").src = t_src;
  // aggiorna casella con nunero di pagina
  document.getElementById("b_pagina").value = pagina + "." + subpagina;

  //alert(document.getElementById("teletextFrame").src);
}

//------------------------------------------------------ EVENT HANDLERS
// Occorre però che vengano inizializzati quando il form è stato caricato!!!

function setHandlers() {
  "use strict";

  // set handlers
  document.getElementById("b_home").addEventListener(`click`, function() {
    calcpage("home");
  });
  document.getElementById("b_pageup").addEventListener(`click`, function() {
    calcpage("pageup");
  });
  document.getElementById("b_pagedown").addEventListener(`click`, function() {
    calcpage("pagedown");
  });
  document.getElementById("b_subup").addEventListener(`click`, function() {
    calcpage("subup");
  });
  document.getElementById("b_subdown").addEventListener(`click`, function() {
    calcpage("subdown");
  });
  // modifica casella input del numero
  document.getElementById("b_pagina").addEventListener(`change`, function() {
    pageinput();
  });
  // rotella del mouse
  window.addEventListener(`wheel`, scrollinput);

  // se la pagina web non esiste
  document
    .getElementById("teletextFrame")
    .addEventListener(`error`, function() {
      pageerror(event);
    });

  // preferiti
  document.getElementById("b_favset").addEventListener(`click`, favset);
  document.getElementById("b_favselect").addEventListener(`change`, favselect);
  document.getElementById("b_favup").addEventListener(`click`, function() { calcpage("favup")});
  document.getElementById("b_favdown").addEventListener(`click`, function() {calcpage("favdown");});
  
  // provider
    document.getElementById("b_provselect").addEventListener(`change`, provselect);

}

//------------------------------------------------------ INIT
// set handlers
setHandlers();

// Variabili globali
// var provider = "rai";
var prov_list = ["rai", "antena 3", "rtp", "la sexta", "rtbf", "orf", "srf1", "rsi1"]
var provider = "rai";

var pagina = 100;
var subpagina = 1;
var movimento = "pageup";
var i_fav = 0;

var preferiti = [
  100,
  103,
  120,
  130,
  140,
  150,
  200,
  209,
  300,
  400,
  501,
  600,
  700,
  800
];

// aggiorna lista provider
updateselect(prov_list, "b_provselect");
// aggiorna lista preferiti
updateselect(preferiti, "b_favselect");

// inizializza
setpage();
