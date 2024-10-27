const fs = require("node:fs");
const { stat } = require("node:fs/promises");
const path = require("node:path");
const readline = require('node:readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const app = {}

// contoh script pembuatan folder
 app.makeFolder = () => {
    rl.question("Input Folder Name : ",(folderName) => {
        const folderPath = path.resolve(__dirname, folderName);
        if (!fs.existsSync(folderPath)) {
            fs.mkdir(__dirname + `/${folderName}`,() => {
                console.log("Success created new folder");
                
            }) 
        } else {
            console.log("Folder is exist")
        }
        
        rl.close();
    });
};

app.makeFile = () => {
    rl.question("Input Folder Name: ", (folder) => {
      rl.question("Input File Name: ", (file) => {
        rl.question("Input Extension Name: ", (ext) => {
          const folderPath = path.resolve(__dirname, folder);
          
          // Check if the folder exists before creating the file
          if (!fs.existsSync(folderPath)) {
            console.error("Folder does not exist. Please create the folder first.");
            rl.close();
            return;
          }
  
          const filePath = path.join(folderPath, `${file}.${ext}`);
          
          try {
            fs.writeFileSync(filePath, "");
            console.log(`Success created file: ${file}.${ext}`);
          } catch (error) {
            console.error("Failed to create file:", error);
          }
          
          rl.close();
        });
      });
    });
  };
  
app.extSorter=()=>{
    rl.question("Input Folder Name to Sort :", (folderName)=>{
        const folderPath = path.resolve(__dirname, folderName);

        if (!fs.existsSync(folderPath)) {
            console.error("Folder does not exist.");
            rl.close();
            return;
        }

        fs.readdir(folderPath,(err, files)=>{
            if (err) {
                console.error("Failed to read Folder : ", err);
                rl.close();
                return;
            }
        files.forEach((file)=>{
            const ext = path.extname(file).slice(1); 
            const destinationFolder = path.join(__dirname, ext);

            if (!fs.existsSync(destinationFolder)) {
                fs.mkdirSync(destinationFolder);
            }
            const oldPath = path.join(folderPath, file);
            const newPath = path.join(destinationFolder, file);

            fs.rename(oldPath, newPath,(err)=>{
                if (err) {
                    console.log(`Error moving File '${file}':`,err);
                } else {
                    console.log(`Moved File '${file}' to folder '${ext}'`);
                }
            });
        });
            rl.close();
        });
    })
};

app.readFolder = () => {
    rl.question("Input folder name to read : ", (folderName)=>{
       const folderPath = path.resolve(__dirname, folderName);
       
       if (!fs.existsSync(folderPath)) {
        console.error("folder does not exist.");
        rl.close();
        return;
       }

       fs.readdir(folderPath,{withFileTypes: true},(err,files)=>{
        if (err) {
            console.log("Failed to read folder:", err);
            rl.close();
            return
        }

        const fileDetails = files.map((file)=>{
            const filePath = path.join(folderPath,file.name);
            const stats = fs.statSync(filePath);
            const extension = path.extname(file.name).slice(1);
            const jenisFile = /^(jpg|png|jpeg|gif)$/i.test(extension) ? 'gambar' : 'text';

            return {
                namaFile:file.name,
                extensi: extension,
                jenisFile:jenisFile,
                tanggalDibuat:stats.birthtime.toISOString().split('T')[0],
                ukuranFile: `${(stats.size/(1024*1024)).toFixed(2)} mb`
            };
        });
        console.log(`Sukses menampilkan isi dari folder ${folderName}:`);
        console.log(JSON.stringify(fileDetails, null, 2));
        rl.close();

       });
       
    });
}

app.readFile=()=>{
    rl.question("Input folder Name to Read :", (folderName)=>{
        rl.question("Input File Name to Read :", (file)=>{
            rl.question("Input Extension Name to Read :", (ext)=>{
                fs.readFile(`./${folderName}/${file}.${ext}`,'utf-8', (err,data)=>{
                    if (err) {
                        console.error("Failed to read file :", err);
                        rl.close();
                        return;
                    }
                    console.log(`content of the file ${file}.${ext}:\n\n ${data}`);
                    rl.close();
                });
            })

        })
             
    });
}

module.exports = app