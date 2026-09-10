// Generate installation icons from the square master without changing its artwork.
// node scripts/build-icons.cjs SOURCE [path-to-playwright-package]
const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(process.argv[3]||'playwright');
const root=path.resolve(__dirname,'..');
(async()=>{
  const source=fs.readFileSync(process.argv[2]);
  const browser=await chromium.launch({headless:true});
  try{
    const page=await browser.newPage();
    const results=await page.evaluate(async base64=>{
      const img=new Image();img.src='data:image/png;base64,'+base64;await img.decode();
      if(img.naturalWidth!==img.naturalHeight)throw Error('Icon master must be square.');
      return [192,512,180,32].map(size=>{
        const canvas=document.createElement('canvas');canvas.width=canvas.height=size;
        const ctx=canvas.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(img,0,0,size,size);
        return {size,data:canvas.toDataURL('image/png').split(',')[1]};
      });
    },source.toString('base64'));
    fs.writeFileSync(path.join(root,'app-icon-source.png'),source);
    for(const {size,data} of results){
      const name=({192:'icon-192.png',512:'icon-512.png',180:'apple-touch-icon.png',32:'favicon-32.png'})[size];
      const buffer=Buffer.from(data,'base64');
      if(buffer.readUInt32BE(16)!==size||buffer.readUInt32BE(20)!==size)throw Error('Unexpected output dimensions');
      fs.writeFileSync(path.join(root,name),buffer);console.log(`${name}: ${size} × ${size} PNG (${buffer.length} bytes)`);
    }
  }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
