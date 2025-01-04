const runProcess = require('./runProcess'),
	  path 		 = require('path')
	  more 		 = ' -unsharp 0.25x0.25+8+0.065 -dither None -posterize 136 -quality 82 -define jpeg:fancy-upsampling=off -define png:compression-filter=5 -define png:compression-level=9 -define png:compression-strategy=1 -define png:exclude-chunk=all -interlace none -colorspace sRGB -strip ';

function trimImages(inPath, outPath, width, callback, test, options) {
	options    = ' -filter Triangle -define filter:support=2 -thumbnail ',
	outPath.replace(/^\$1./, (match, _, str)=>test=str.split('.')[1]),

	dirname = path.dirname(inPath),
	inPath = path.basename(options=inPath+options).split('.'),
        options+=width||300,
	
	options += more + (inPath.length>1&&test
	? dirname+path.sep+(inPath.length>2?(inPath.pop(), inPath.join('.')):inPath[0])+'.'+test
	: outPath),
	runProcess('magick', options.split(' ').map(decodeURI), callback)
}
module.exports = trimImages;

let dir, index=0, fxn;
/*
runProcess('ls', [dir='../../wix-challenge/magicpattern.jpg'], (files, image, len)=>{
    
  files=files.split(/\n/).filter(e=>e.match('.png')).map(encodeURI),
  files = (len = files.length)===1?files[0]:files,

  fxn=_=>trimImages(image=path.join(dir, files[index++]), '$1.jpg', void 0, err=>{
    if(err) console.log(err);
    else console.log('[::MAGICK::] Trimmed image', [image], 'in', dir), index<len&&fxn();
  })
  //fxn()
})
*/

trimImages('img/dane-deaner-unsplash.jpg', '$1.jpg', void 0, console.log)