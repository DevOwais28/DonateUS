    
  import mongoose from "mongoose";
  
  export const connectDB = (string) =>
    mongoose
      .connect(string, { dbName:"DonationManagementSystem" })
      .then((c) => {
        console.log(`Connected with ${c.connection.name}`);
      })
      .catch((e) => console.log(e));
  
  