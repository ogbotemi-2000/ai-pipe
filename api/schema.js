const puppeteer = require('puppeteer-core'),
      path   = require('path'),
      fs     = require('fs'),
      both = require('../js/both'),
      file   = path.join(require('../utils/rootDir')(__dirname), './config.json'),
      config = fs.existsSync(file)&&require(file)||{...process.env};

module.exports = function(request, response) {
  let { nodes, url } = request.body, result;
  /**serialize the needed function in the imported object for usage in puppeteer */
      _both = { asText: both.asText.toString() };

  console.log('::GOT HERE::'),
  new Promise(async (res, rej) => {  
    puppeteer.connect({
      headless: false,
      browserWSEndpoint: config.BROWSER_WS,
    }).then(browser=>browser.newPage().then(async page=>{
  
      await page.setUserAgent('5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
      await page.goto(url, { waitUntil:'load', timeout:1e3*60 });
      
      const result = await page.evaluate((nodes, both) => {
        /** convert serialized function string back into a function to execute it */
        both.asText = new Function(`return ${both.asText}`)()
        /**remove needless nodes from the DOM */
        document.head.remove(), ['link', 'script', 'style', 'svg'].forEach(tag=>document.body.querySelectorAll(tag).forEach(el=>el.remove()))
        /**defined "node" - the variable present in the dynamic scripts locally to make it available in the 
          custom function context when created with new Function */
        let page = {}, node, fxns = Object.keys(nodes).map(key=>
          /**slip in the local variable - page and prepend a return keyword to make the function string work 
           * as expected when made into a function
          */
          nodes[key] = new Function(`return ${nodes[key].replace(',', ', page, ')}`)()
        );
        /** apply the functions for the nodes to retrieve data as the DOM is being traversed */
        both.asText(document.body, (_node, res)=>fxns.find(fxn=>res=fxn(node=_node, page)) && /*handle fetching media assets later here*/res || '');
        return page
      }, nodes, _both);
      res(result), await browser.close();
    }).catch(rej))
    .catch(rej)
  }).then(page=>result = page)
  .catch((err, str, name)=>{
    str = err.toString(), name = err.constructor.name, result = {
      error: /^\[/.test(str) ? `${name}: A sudden network disconnect occured` : str
    }
  }).finally( ()=> {
    response.json(result)
  })
}
