let both = {
	dBParts: (dbString)=>{
    let parts =[], sls =['0,-3', '0,-1'], S=(s,a)=>s.slice(...a), rgxes = [/^[^/]+\/+/, /^[^:]+:/, /[^]+@/];
    /*avoided redundancy for similar elements*/sls.push(sls[1], sls[1], sls[1], sls[1], ''), rgxes.push(rgxes[1], rgxes[0], /^[^?]+\?/, /[^]+/),
		sls.forEach((slice, i)=>{
			dbString = dbString.replace(rgxes[i], match=>(parts.push(S(match, sls[i].split(','))), ''))
		});
		return parts
	},
	asText: function(node, fn, txt='', _txt, cb, val) {
		(cb=(nodes, flag, bool)=>[].slice.call(nodes).forEach((ch, res)=>{
			res = ch.data || ch.value || '',
			txt += bool = fn&&fn.call ? fn(ch) : res,
			!bool&&ch.childNodes.length&&cb(ch.childNodes, !0)
		}))(node.childNodes),
		_txt = node.innerText,
		val = _txt.length>txt.length ? txt : txt;
		return txt;
	},
	format: function(str) {
		return str&&str.replace(/,/g, e=>e+'\n\t').replace(/\{|\}/g, e=>'\n'.repeat(e=='}')+e+'\n\t'.repeat(e=='{'))
	},
	uuid : (a) => (a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, both.uuid))
}

if(!this.window) module.exports = both;