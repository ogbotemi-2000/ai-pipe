/** File to handle the code for everything that has to do with flags */
!function() {

  let API = 'https://api.devcycle.com/v1/', interval, countdown=node=>{
    clearInterval(interval),
    interval=setInterval(_=>requestAnimationFrame(_=>{

    }), 1e3)
  }, query=args=>fetch(`${API}${args.path}`, {
    method: args.method,
    headers: {
      "authorization": getAuthToken.__token/** references __token for when getAuthToken gets initialized */,
      "content-type": "application/json"
    },
    ...(args.body&&{body: JSON.stringify(args.body)})
    // body: JSON.stringify({ 'description': "A learning experience on DevCycle's API" })
  }).then(res=>res.json());

  /** hoisting local variable to initialize it in queryProvider and use elsewhere */
  var notify;

  async function initProjectSDKS(_ids)  {
    /** using a counter outside the promise and callback to signal the end of its loop since some elements in arrays in a
     * promisified context may resolve earlier than others and thus result in an inaccurate boolean to know the end of the loop */
    let count=0;
    return new Promise(res=>{
      _ids.forEach(_id=>{
        query({method:'GET', path:`projects/${_id}/environments`}).then(envs=>{
          ++count,
          envs.forEach((env, i)=>{
            let { key } = env.sdkKeys.client[0];
            /** Initializing all environments present in each project with its id, setting user_id to the name of this web app with its version*/
            ((page.envs||={})[_id] ||={})[env.key] ||= DevCycle.initializeDevCycle(key, { user_id: "SwitchFlow_v0.0.1" }, { logLevel: 'info' })
            if(count===_ids.length) res();
          })
        }).catch(notify)
      })
    })
  }
  /** moved here to access scoped but useful methods */
  page.checkVars=function(_var, expected, type, def) {
    /**types deserving scrutiny are JSON, Boolean and Number */
    let err, res=[], check =(arg, i)=> {
      arg=arg.trim()
      switch(type.toLowerCase()) {
        case 'boolean': err=(arg!=='true'&&arg!=='false'); break;
        case 'number': err=isNaN(arg=+(arg.length?arg:'intentional NaN to negate +""===0')); break;
        case 'json': console.log('::JSON::', [arg]), err=!(arg=parse(arg)); break;
        case 'string':  arg=arg.replace(/"/g, ''); break;
      }
      res[i]=arg;
      return !err
    }, values = [expected, def].map(check);
    err = values.filter(e=>e).length !== values.length;
    if(err) return (Abbr.to(evaluatedFlags,['pN',{2:'lEC'}]).click(), notify({whole:!0, message:`The ${values[0]?'default ':'expected '} value of \`${values[0]?def:expected}\` provided for - \`${_var}\` is not compatible with its type -\`${type}\` `}, '5s'));
    
    /*devCycleClient has been properly assigned prior in this space as a global */
    return  JSON.stringify(res[0]) === JSON.stringify(devCycleClient.variableValue(_var, res[1]))
    
    
  },
  page.assignFlag=function(node, variable, type) {
      let {0:flag, 1:value, 2:def} = variable, _var = page.variables[flag], uid = uuid(), checked=this.checkVars(flag, value, type, def),
      colours={'staging':'red', 'development':'yellow', 'production':'green'};
      if(checked===void 0) return;
      
      let li = crE('li', [], {
        className:`hover:bg-yellow-50`,
        innerHTML: `<span class="left-0 right-0 top-px absolute text-center">${_var.env} <i class="align-middle inline-block bg-${colours[_var.env]}-300 p-1.5 rounded-full"></i></span>
<code class="mt-3 justify-between flex">${flag} <strong>${checked}</strong></code><p class="truncate w-full">project: <code>${_var.project}</code></p>
<p class="truncate w-full">feature: <code>hello-togglebot</code></p><div id="${uid}" class="absolute z-1 inset-0"></div>`
      });
      /**store it for when it is time to export the page */
      page.variables[flag].uid = uid, evaluatedFlags.appendChild(li), page.variables[flag].value=checked,
      Abbr.to(evaluatedFlags,['pN','cL']).remove('show'), node.classList.add('__'+uid),
      (page.values||={})[uid]= checked
  }

  window.get_writeFlags = function(_id, env) {
    /** to expose them for use in writing flags to the UI and evaluating them at the end */
    (page.meta||={})._id = _id, page.meta.env=env
    let self = get_writeFlags, vars;
    /**devCycleClient below is initailzed directly without being defined prior to make it globally available */
    devCycleClient = page.envs[_id][env];
    Abbr.to(UIflags, [{2:'pN'},'cL']).remove('show')/** hiding the variables listing with visibility:hidden everytime to reduce load while altering its contents */,
    self.write||=data=>{
      /** not using vars above directly herer to prevent unwanted issues with the closure in this context */
      let item = crE('a', [], {href:'javascript:void(0)', className:'items-end flex space-x-2'}), dump=document.createDocumentFragment();
      data.forEach((datum, index)=>{
        item = item.cloneNode(0);
        let { 0:name, 1:value } = datum.split(/\s+/); 
        /*simply add the values of the variables to the array and separate them by spaces*/
        item.innerHTML+=`<code style="--tw-bg-opacity:0.4" class="ripple relative sm:px-2 border border-gray-300 py-2 rounded bg-white shadow p-1.5 w-1/3 rounded-xl">${name.replace('•', ' • ')}</code>
<div class="text-center p-1.5 border-b border-current w-1/3" contenteditable="">${value}</div>
<div class="text-center p-1.5 border-b border-current w-1/3" contenteditable=""></div>`,
        dump.appendChild(item)
      }), requestAnimationFrame(_=>{ Abbr.to(UIflags, [{2:'pN'},'cL']).add('show'), /*legacy way of accessing element directly via its id */window.UIflags.innerHTML='', UIflags.appendChild(dump),
        /*add ripple animations after mutation*/animations.addRippleAnimations(UIflags)
      })
    }, devCycleClient.onClientInitialized(function() {
      
      /** obtain values via the SDK directly afterwards */
      vars = devCycleClient.allVariables();
      let keys;
      if(!(keys=Object.keys(vars)).length) return notify({ message:`The selected environment - ${env.toUpperCase()} has no variables defined for it in the SDK. Choose a different environment`, whole:!0 }, '8s')
      
      keys = keys.map((key, obj)=>(obj=vars[key], `${obj.key}•${obj.type} ${JSON.stringify(obj.value)}`)),
      self.write(keys), console.log('::VALUES::SDK::', devCycleClient.allFeatures())
    })
  }

  window.queryProvider = function queryProvider(err, main, notice, node) {
    // countdown(node)
    let dump=document.createDocumentFragment(), nodes=[], detail = crE('detail', [{name:'open', value:''}, {name:'class', value:'block cursor-pointer relative hover:bg-blue-50'}], []);
    /** initializing hoisted variable here to use the closure in this function body to make it work outside this function */
    notify=(arg, hasten)=>{
      let { message, error, error_description } = arg; message&&=(('You are disconnected from the internet • ').repeat(!arg.whole)+ message),
      error&&=`Request failed. ${error_description} • ${error}`;

      /** message comes first in the logical operation below to prioritize network disconnect error over API errors */
      if(!(arg=message||error)) return;/**the network request has no errors */
      Abbr.to(notice,'fC').data=arg, Abbr.to(notice,'cL').add('show'), Abbr.to(notice, ['fEC','cL']).add('out-in-out'),
      hasten&&Abbr.to(notice, 'fEC').style.setProperty('--dur', hasten)
    };

    if(err) return notify({whole:!0, message:err});
    /**First get all the projects available in the client's account */
    query({method:'GET', path:'projects'}).then(projects=>{
      /**set project.variables to an empty objeect whenever a client wishes to retrieve features and variables again */
      notify(projects) || (page.variables||={}, projects.forEach((project, index)=>{
        let { _id, createdAt, name } = project;
        nodes.push(detail = detail.cloneNode()),
        detail.innerHTML =
        `<summary class="border border-current rounded-b-lg rounded-t-3xl cursor-pointer pt-9 sm:pt-12 relative p-3 [&amp;>*]:inline-block">
<div class="top-0 left-0 sm:absolute relative">
<div class="rounded-tl-3xl rounded-b-xl border border-current bg-gray-50 absolute top-0 tooltip w-full [&amp;>*]:text-left overflow-hidden" style="z-index:auto" onclick="let t=event.target; if(t.tagName!=='BUTTON') return;
this.children[0].before(t), Abbr.to(this,['nES','lEC','pS']).data = t.textContent"><button class="hover:bg-yellow-200 w-full font-sans p-2">development</button><button class="hover:bg-red-200 w-full font-sans p-2">staging</button><button class="hover:bg-green-200  font-sans w-full p-2">production</button>
</div><a class="w-40 rounded-l-2xl inline-block ripple relative bg-gray-50 rounded-b-xl border border-current text-sm p-2 [&amp;>*]:inline-block [&amp;>*]:p-2 [&amp;>*]:align-middle" href="javascript:void(0)"><i class="border-current rounded-full border bg-yellow-200"></i><i class="-mx-2.5 border-current rounded-full border bg-red-200"></i><i class="border-current rounded-full border bg-green-200 mr-1"></i>development<i class="mt-1 float-right align-middle inline-block ml-2 fa fa-caret-down" style="padding:0px;"></i></a>
</div>
<code class="border-current border-l border-b px-3 p-1 right-0 sm:w-auto w-full rounded-tl-3xl sm:rounded-tl-none absolute top-0">_id: ${_id}</code>
<code>Project name • ${name}</code><hr class="mx-5 border-2 p-0.5 border-current rounded-full"><code><i class="fa fa-clock"></i> createdAt • ${createdAt}</code></summary>`,

        dump.appendChild(detail),
        /** create collapsible details for each feature along with its variation and also for the variables available in each */
        query({method:'GET', path:`projects/${_id}/features`}).then(features=>{
          notify(features) || features.forEach(feature=>{

            let { name, key, variations, variables } = feature, varies = variations.map((v, i)=>{
              return `<li>Variation: <code>${v.name}</code><code class="p-2 inline-block">${JSON.stringify(v.variables).replace(/\{|\}|"/g,'').replace(/\:/g,'=').replace(/,/g,', ')}</code></li>`

            }).join(''), vars = variables.map((v, i)=>{
              return `<span class="px-2 align-middle inline-block p-1 border-2 border-gray-500 rounded-xl border-dashed" style="--tw-bg-opacity:0.9;">${v.status}</span>
<code class="p-2 inline-block">${(page.variables[v.key]||={project:project.name, feature:name},  v.key)} • ${v.type}</code><hr class="align-middle inline-block border-0 p-px bg-current rounded-full py-3">
description • <span class="p-2">${v?.validationSchema?.description||''}</span>`

            }).join('<hr class="my-1 border-gray-300 shadow">');

            nodes[index].innerHTML+=`<details class="border-l border-r border-current px-2"><summary class="cursor-pointer">
Feature: <code>${name} • ${key}</code></summary>
<ul class="space-y-1 list-disc list-inside">${varies}</ul></details>
<details ${features.length==1?'open':''} class="mt-1 px-2 pb-2 border border-current rounded-b-xl border-t-0"><summary class="cursor-pointer">Variables (${variables.length})</summary>${vars}</details>`
          }), initProjectSDKS(projects.map(project=>project._id)).then(_=>{
            /** wait until last project has been initialized by SDK before displaying fetched data */
            requestAnimationFrame(_=>{ Abbr.to(main, 'cL').add('show'), main.replaceChild(dump, Abbr.to(main,'fEC')), /*add ripple animations again*/animations.addRippleAnimations(main) })
          })
        }).catch(notify)
      }))
    }).catch(notify)
  }

  /** This function is defined as async because async functions wrap their return values as promises whose .catch is never called
   * since it wasn't rejected in the first place requiring a boolean check in .then to act as .catch instead
   */
  window.getAuthToken = async function getAuthToken(DEVCYCLE_API_CLIENT_ID, DEVCYCLE_API_CLIENT_SECRET) {
    let error;
    if(getAuthToken.expiresAt > Date.now()) return [getAuthToken.__token, error];

    if(!(DEVCYCLE_API_CLIENT_ID = window.providerConfig.id.value)||!(DEVCYCLE_API_CLIENT_SECRET = window.providerConfig.secret.value)) return;

    return fetch("https://auth.devcycle.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        audience: "https://api.devcycle.com/",
        client_id: DEVCYCLE_API_CLIENT_ID,
        client_secret: DEVCYCLE_API_CLIENT_SECRET,
      }),
    }).then(res=>(res.ok||(error=`Request failed due to a HTTP status of ${res.status} for \`https://auth.devcycle.com/oauth/token\`. `), res.json()))
    .then(json=>{
      json.error&&(error &&=error+ `${(json.error_description||'')} • ${json.error}`),
      getAuthToken.auth = json, getAuthToken.expiresAt = Date.now() + json.expires_in * 1000;
      return [getAuthToken.__token = json.access_token, error]
    }).catch(err=>{
      return [null, 'Unable to make requests to `https://auth.devcycle.com/oauth/token` - you are disconnected from the internet • '+ err.message]
    })
  }

  
  /**
   * SCHEMA:
   * GET - https://api.devcycle.com/v1/projects/${project_id}/environments returns environments and SDK keys
   */

}()
