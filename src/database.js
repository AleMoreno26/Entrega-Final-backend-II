import mongoose from 'mongoose';



// import model

mongoose.connect("mongodb+srv://am2408693:coderhouse@cluster0.rsppv.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
.then(()=> console.log("Nos conectamos a la BD correctamente"))
.catch((error)=> console.log("Tienes un error no pudimos conectar", error))



export default mongoose;
