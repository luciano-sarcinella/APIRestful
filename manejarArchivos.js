let fs =require ("fs");
let path = require("path");

class Handle {
    constructor(url_){
        this.url = url_;
    }

    async  getAll(){
        try{
            let data = await fs.promises.readFile(this.url,'utf-8');

            return JSON.parse(data);
        }catch(error){

            return [];
        }
    }

    async deleteById(id){
        try{
            let resp = [];
            let data = await this.getAll();
            for(const key in data){
                if(data[key].id == id){
                    data.splice(key, 1);
                }
                console.log(data);
            }
            let content = JSON.stringify(data, null,2);
            await fs.promises.writeFile(this.url, content);

            return data;
        }catch(error){
            throw error;
            console.log(error);
        }
    }

   async getbyId(id){
        try{
            let resp = [];
            let data = await this.getAll();

            return data.find(x => x.id == id);
        }catch(error){
            console.log(error);
        }
    }
    async save(producto){
        try{
            let data = await this.getAll();
            let newId = await this.getNewId(data);
            let newProducto = {id: newId, ...producto};
            data.push(newProducto);
            let content = JSON.stringify(data, null,2);
            await fs.promises.writeFile(this.url, content);

            return newId;
        }catch(error){
            console.log(error);
        }
    }
    async update(producto){
        let existe=0;
        try{
            let resp = [];
            let data = await this.getAll();
            for(const key in data){
                if(data[key].id == producto.id){
                    existe = 1;
                    resp = await this.deleteById(producto.id);
                }
            }
            if(existe == 1){
            resp.push(producto);
            let content = JSON.stringify(resp, null,2);
            await fs.promises.writeFile(this.url, content);

            return producto.id;
        }else{
            return "el producto no existe";
        }
        }catch(error){
            console.log(error);
        }
    }
    async getNewId(productos){
        try{
            let resp = productos.reduce((max, producto) => {
                return producto.id > max ? producto.id : max;
            }, 0);
            return resp + 1;
        }catch(error){
            console.log(error);
        }
    }
}

module.exports = Handle;