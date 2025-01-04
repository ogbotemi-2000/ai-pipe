let body, fonts=[], googleFonts=[], fontsList=crE('div', [], []);
fetch('fonts.txt').then(res=>res.text()).then(txt=>{
  googleFonts = txt.split('\\n');
  if(debug) return;
  N(26, 64).map((ch, opts)=>{
    ch=String.fromCharCode(ch);
    if(opts = googleFonts.filter(e=>e.charAt(0)==ch).map(opt=>`<option value="${opt}">${opt}</option>`).join('')) fontsList.appendChild(crE('datalist', [], {id:`${ch}_fonts`, innerHTML:opts}));
  })
});

let bodyCls, Ev_onclick = Ev('onclick'),
heap/*a variable that is initiallized with quickly changing values. It is for temporarily storing values without needing to create variables*/, clones = [],
page = {
  flags: [1],
  asText: function(node, fn, txt='', _txt, cb, val) {
    (cb=(nodes, flag, bool)=>slice(nodes).forEach((ch, res)=>{
      res = ch.data || ch.value || '',
      txt += bool = fn&&fn.call ? fn(ch) : res,
      !bool&&ch.childNodes.length&&cb(ch.childNodes, !0)
    }))(node.childNodes),
    _txt = node.innerText,
    val = _txt.length>txt.length ? txt : txt;
    return txt;
  },
};

w_Ev('mousemove')(function(ev) {
    // let { pageX, pageY } = ev, pad=30;
    // pageX+=5, pageY+=20,
    // (pageX+pad<innerWidth)&&(pageY+pad<innerHeight)
    // &&Abbr.to(flagMouse,'cL').contains('show')
    // &&(requestAnimationFrame(_=>{
    //     flagMouse.style.setProperty('--x', `${pageX}px`),
    //     flagMouse.style.setProperty('--y', `${pageY}px`)
    // }))
}),
w_Ev_dom(function() {
  body = document.body, bodyCls = body.classList,
  animations.addRippleAnimations()
  clones.push(document.querySelector('body>aside>nav>aside>section pre').cloneNode(!0))
}),
w_Ev('keyup')(function(ev) {
  let { key, code, keyCode } = ev;
  if(/escape/i.test(key||code)) bodyCls.remove('select-f098d3d3'),
    /*.map is used below to avoid repetitions. Now that that is out of the way,
      the code below is a UX strategy to take the user back to the section for the UI flags should the user
      press 'ESC' either on a whim or by accident when choosing an element to flag
    */
    ['contains','remove'].map(m=>Abbr.to(body,'cL')[m]('toggle-cursor'))[0]&&Abbr.to(evaluatedFlags,['pN',{2:'lEC'}]).click();
}),
(page.selected =_=>new Promise(res=>{
  w_Ev(Ev_onclick)(function(ev) {
    let tgt = ev.target, { designMode } = document;
    if(switchFlow==tgt||relation(switchFlow, tgt)[0]) return;
    /* initial select code*/
    if(bodyCls?.contains('select-f098d3d3')) {
      if(Abbr.to(body,'cL').contains('toggle-cursor')) res(tgt), Abbr.to(body,'cL').remove('toggle-cursor');
      else page.traversing?page.node=tgt:page._$0 = page.$0 = tgt, res();
      /* code they both have in common goes here */
      bodyCls.remove('select-f098d3d3')
    };
    /*no cascade here to allow directly editing the element that was just selected*/
    if(designMode === 'on') console.log('::NOT YET IMPLEMENTED::', tgt);
    
  })
}))(/*INIT: called once to register click event on window object*/);


function store(prop, el, attr) {
  if(!(el=page[prop])) return;
  let stored, { attributes, nodeName, innerHTML, data } = el, msg='', index, attrs, nodes = parse(localStorage.getItem(key='__nodes_4087eef5e5ea')||'""')||[],
  /*getAttribute is invoked in the manner below to silently ignore errors when initing store.get(...) by calling store once on page load*/
  ind = el.getAttribute?.call(el, attr='data-storageIndex');
  /*using nodeName because it exist on all nodes text or otherwise*/
  if(nodeName)  {
    attributes?.length&&(attrs = {}, [].forEach.call(attributes, attr=>attrs[attr.name] = attr.value)),
    stored = { ...(data&&{data}), ...(attrs&&{attrs}), ...(innerHTML&&{innerHTML}) },
    /*double equality because null == void 0 is true */
    ind==void 0
    ? el.setAttribute(attr, (index=nodes.push(stored)-1/*reduce by one due to nodes.push's return value */, msg=`Storing the metadata for the node page.${prop} for the first time at index: ${index}`, index))
    : msg = `Element exists in storage, updating its metadata stored at index ${(nodes[+ind] = stored, ind)}`,
    console.log('::NODE::', nodes), localStorage.setItem(key, JSON.stringify(nodes));
    return msg;
  }
}

function parse(str) {
    str = str.replace(/'/g, '"');
    let res;
    try {
        res = JSON.parse(str)
    } catch(err) {
        console.log(err)
    }
    return res;
}

let htmls=[0,1];
page.saveOrExport = function(node, save) {
    if(page.objectURL) return node.href=page.htmls[+!save]
    let script = crE('script', [], {
      src: "https://cdn.tailwindcss.com"
    });
    htmls = htmls.map(_=>document.documentElement.cloneNode(!0));

    /**remove all nodes used and marked in app from the cloned page*/
    htmls.forEach(html=>{
      html.querySelectorAll('[data-switch-flow]').forEach(node=>{
        node.remove()
      }), /** remove the root node that contains everything itself */
      html.querySelector('#switchFlow').remove(),
      html.querySelector('head').prepend(script);
    }),
    /**apply flags when exporting */
    page.values&&Object.keys(page.values).forEach(uid=>(page.values[uid]) && htmls[+!save].querySelector(`.__${uid}`)?.remove());
    /**create an URL that resolves to the node in memory for previews and downloads */
    node.href = (page.htmls = htmls.map(html=>URL.createObjectURL(new Blob(['<!DOCTYPE HTML>'+html.outerHTML.replace(/\&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')], { type: 'text/html' }))))[+!save]
}
page.toHTML = function(txt) {
  /** using replace over match because it makes it easier to match expresions without much check for errors */
  /*the first regex below obtains expressions that are flanked by angle brackets*/
  let q=(n, s)=>slice(n.querySelectorAll(s)), rgxes = [/<[^>]+>/, /^<|>$/g, /[^\s]+/], attr='<!DOCTYPE HTML>', node, name;
  [0,1].forEach(e=>/<\!doctype\s+html>/i.test(attr)&&(txt=txt.replace(rgxes[0], m=>(attr=m, '')))),
  
  /** remove angle brackets from the tag that wraps everything else */
  attr = (attr=attr.replace(rgxes[1],'').replace(rgxes[2], m=>(name=node=m, '')).trim())&&attr.split(/"\s/).map((el, name, value)=>(({0:name, 1:value}=el.split('=')), {name, value})),
  node = crE(node, attr||[], { innerHTML: txt });
  /** to lowercase to consider old markup that capitalizes node names */
  if(name.toLowerCase()==="html") {
    let damned = q(node, '[data-switch-flow]');
    /**aside#switchFlow and the nodes queried above existing is not a coincidence and implies a copycat.
     * However, the nodes have to be removed because their presence in the DOM is redundant and will affect the web app's behaviour
     */
    damned.length&&(damned=damned.concat(q(node.children[1], 'aside#switchFlow'))), damned.forEach(e=>e.remove()),
    
    (name = q(node, 'title')[0])?.textContent&&(document.title=name.textContent, name.remove()),
    /** remove some metadata already available on the current page */
    ['[charset=utf-8]', '[name=viewport]'].forEach(s=>q(node, 'meta'+s)[0]?.remove()),
    ['head', 'body'].forEach(tag=>{
      /** remove other nodes on the page aside the ones used in the app*/
      q(document, `${tag} > *`).forEach(el=>((/script|link/.test(el.tagName.toLowerCase())&&tag==='head')?!el.hasAttribute('data-switch-flow'):tag==='body'&&el.id!=='switchFlow')&&el.remove()),
      /**append the nodes in the imported markup to the page */
      q(node, `${tag} > *`).forEach(el=>document[tag].append(el))
    })
  }
}